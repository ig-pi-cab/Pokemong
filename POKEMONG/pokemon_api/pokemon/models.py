from django.db import models

class Region(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

class Tipo(models.Model):
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre

class Pokemon(models.Model):
    nombre = models.CharField(max_length=100)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True, blank=True)
    tipos = models.ManyToManyField(Tipo, through='PokemonTipo')

    def __str__(self):
        return self.nombre

class PokemonTipo(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    tipo = models.ForeignKey(Tipo, on_delete=models.CASCADE)
