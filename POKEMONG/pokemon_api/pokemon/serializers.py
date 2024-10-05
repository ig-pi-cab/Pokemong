from rest_framework import serializers
from .models import Region, Tipo, Pokemon, PokemonTipo
import re

def validate_nombre(value):
    if not re.match(r'^[A-Za-záéíóúÁÉÍÓÚñÑüÜ]+$', value):
        raise serializers.ValidationError("El nombre solo puede contener caracteres alfabéticos.")
    if len(value) < 3 or len(value) > 20:
        raise serializers.ValidationError("El nombre debe tener entre 3 y 20 caracteres.")
    return value

def validate_unique_nombre(model, value, instance=None):
    queryset = model.objects.filter(nombre=value)
    if instance:
        queryset = queryset.exclude(id=instance.id)
    if queryset.exists():
        raise serializers.ValidationError(f"Ya existe un registro con el nombre '{value}'.")
    return value

class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = '__all__'

    def validate_nombre(self, value):
        value = validate_nombre(value)
        return validate_unique_nombre(Region, value)

class TipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tipo
        fields = '__all__'

    def validate_nombre(self, value):
        value = validate_nombre(value)
        return validate_unique_nombre(Tipo, value)

class PokemonSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True) 
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region', write_only=True
    )
    
    tipos = TipoSerializer(many=True, read_only=True)
    tipos_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tipo.objects.all(), source='tipos', write_only=True
    )

    class Meta:
        model = Pokemon
        fields = ['id', 'nombre', 'region', 'region_id', 'tipos', 'tipos_ids']

    def validate_nombre(self, value):
        return validate_unique_nombre(Pokemon, value, instance=self.instance)

    def create(self, validated_data):
        tipos_data = validated_data.pop('tipos', [])
        region_data = validated_data.pop('region')

        pokemon = Pokemon.objects.create(region=region_data, **validated_data)

        for tipo in tipos_data:
            PokemonTipo.objects.create(pokemon=pokemon, tipo=tipo)

        return pokemon

    def update(self, instance, validated_data):
        tipos_data = validated_data.pop('tipos', None)
        region_data = validated_data.pop('region', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if region_data:
            instance.region = region_data

       
        if tipos_data is not None:
            instance.tipos.clear() 
            for tipo in tipos_data:
                PokemonTipo.objects.create(pokemon=instance, tipo=tipo)

        instance.save()
        return instance
