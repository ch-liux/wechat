# Generated by Django 2.1.7 on 2019-05-15 15:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('art', '0004_auto_20190515_1344'),
    ]

    operations = [
        migrations.AlterField(
            model_name='art',
            name='types',
            field=models.IntegerField(choices=[(0, '游戏'), (1, '旅游'), (2, '唱歌'), (3, '其它')], default=1, verbose_name='类型'),
        ),
    ]
