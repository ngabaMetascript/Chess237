from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Player(models.Model):
	m_user = models.OneToOneField(User,on_delete = models.CASCADE)
	m_wins = models.IntegerField(default=0,blank = True, null = True)
	m_loses = models.IntegerField(default=0,blank = True, null = True)
	m_draws = models.IntegerField(default=0,blank = True, null = True)
	m_logo = models.FileField(blank = True, null = True)
	m_friends = models.ManyToManyField('self',blank=True, related_name='friends')
	def elo(self):
		return self.m_draws*1 + self.m_wins*5
	def __str__(self):
		return str(self.m_user)
	def in_room(self):
		return ( Room.objects.filter(m_player1__id = self.id).exists() or Room.objects.filter(m_player2__id = self.id).exists() )

class Room(models.Model):
	m_code = models.IntegerField(blank = True, null = True)
	m_label = models.CharField(unique=True,max_length=12,blank = True, null = True)
	m_player1 = models.ForeignKey(Player,null=True,blank=True, related_name='player1',on_delete = models.CASCADE)
	m_player2 = models.ForeignKey(Player,null=True,blank=True, related_name='player2',on_delete = models.CASCADE)
	m_move = models.CharField(max_length=8,blank = True, null = True)
	m_turn = models.IntegerField(default=0,blank = True, null = True)
	is_available = models.IntegerField(default=1,blank = True, null = True)
	date_created =models.DateTimeField(blank=True,null=True,auto_now_add=True)
	m_stat = models.CharField(max_length=3,blank = True, null = True)
	m_message = models.TextField(blank = True, null = True)
	m_send = models.IntegerField(default = -1,blank = True,null = True)
	m_admin_message = models.BooleanField(blank = True,null = True)
	#0, P1 envoie mess, 1, P2 envoie, 2 le message envoyé a ete lu, 3 P1 capitule, 4 P2 capitule

	def get_role(self,player):
		result = None
		if player == self.m_player1.m_user.id:
			result = 1
		elif player == self.m_player2.m_user.id:
			result = 2
		return result

	def other_player(self,player):
		if player == self.m_player1.m_user.id:
			result = self.m_player2
		else:
			result = self.m_player1
		return result

	def __str__(self):
		return str(self.m_player1) + '-' +str(self.m_player2)

	class Meta:
		ordering=('date_created', )

class Message(models.Model):
	m_room = models.ForeignKey(Room, related_name='messages',on_delete = models.CASCADE)
	m_message = models.TextField(blank=True,null=True)
	m_status = models.IntegerField(default=0,blank=True,null=True)#0 not viewed, 1 viewed
	m_sender = models.IntegerField(blank=True,null=True)
	m_timestamp = models.DateTimeField(auto_now = True)
	def __str__(self):
		return self.m_message

