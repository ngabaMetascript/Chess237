# Generated by Django 2.2.1 on 2020-05-05 05:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chess', '0010_auto_20200505_0420'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='room',
            options={'ordering': ('-date_created',)},
        ),
    ]
