# Generated by Django 2.2.1 on 2020-04-28 11:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('m_code', models.TextField()),
                ('m_label', models.CharField(max_length=12, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('m_room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='position', to='chess.Room')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('m_message', models.TextField()),
                ('m_room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='chess.Room')),
            ],
        ),
    ]
