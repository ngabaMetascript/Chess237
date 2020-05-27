# Generated by Django 2.2.1 on 2020-04-29 16:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chess', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='m_code',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='room',
            name='m_label',
            field=models.CharField(blank=True, max_length=12, null=True, unique=True),
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('m_user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='room',
            name='m_player1',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player1', to='chess.Player'),
        ),
        migrations.AddField(
            model_name='room',
            name='m_player2',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player2', to='chess.Player'),
        ),
    ]
