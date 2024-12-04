from django.db import models


# Create your models here.
class Position(models.Model):
    title = models.CharField(max_length=100, blank=False, verbose_name="Позиция")
    portion = models.CharField(max_length=30, blank=True, verbose_name="Порция (шт/гр/мл)")
    description = models.TextField(blank=True, verbose_name="Описание")
    price = models.IntegerField(blank=False, verbose_name="Цена")
    cat = models.ForeignKey('Category', on_delete=models.PROTECT, null=True, related_name='positions')

    objects = models.Manager()

    def __str__(self):
        return self.title

    def filter_by_cat(self, cat_id):
        return self.objects.filter(cat_id=id)



class Category(models.Model):
    name = models.CharField(max_length=100, db_index=True)

    objects = models.Manager()

    def __str__(self):
        return self.name
