from django.shortcuts import render,redirect,HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from .models import *
import time
# Create your views here.
def index(request):
	template='chess/index.html'
	context = {}
	return render(request,template,context)

def disc(request):
	logout(request)
	return redirect("/")

def check(request):
	pseudo = request.GET.get('player',None)
	passwo = request.GET.get('password',None) 
	print(pseudo)
	data = {'exists':authenticate(username=pseudo,password=passwo) != None} 
	return JsonResponse(data)

def log(request):
	print(request.POST['username'])
	user = authenticate(username = request.POST['username'],password = request.POST['password'])
	if user:
		login(request,user)
	return redirect('/')

def new(request):
	player = int(request.GET.get('player',None))
	PLAYER = Player.objects.get(m_user__id=player)
	game = 0
	try:
		room = Room.objects.filter(is_available=1,m_player2 = None).last()
		room.m_player2 = PLAYER
		room.is_available = 2
		room.save()
		game = player
	except:
		room = Room(m_player1 = PLAYER)
		room.save()
		ID = room.id
		for i in range(6):
			time.sleep(2)
			room = Room.objects.get(id=ID)
			if room.is_available == 2:
				break
			else:
				rooms = Room.objects.exclude(m_player1 = PLAYER).filter(is_available=1,m_player2 = None)
				if rooms.count() != 0:
					room = rooms.last()
					room.m_player2 = PLAYER
					room.is_available = 2
					room.save()
					break
		room = Room.objects.get(id=ID)
		if room.is_available == 2:
			game = room.is_available = 3
		else:
			game = room.is_available = 0
		room.save()
	data = {'game':game}
	print(game)
	if game != 0:
		otherP = room.other_player(player)
		data['room'] = room.id
		data['p1'] = room.m_player1.m_user.username.capitalize()
		data['p2'] = room.m_player2.m_user.username.capitalize()
		data['role'] = room.get_role(player)-1
		data['opp_name'] = otherP.m_user.username
		data['wins'] = otherP.m_wins
		data['loses'] = otherP.m_loses
		data['draws'] = otherP.m_draws
		data['logo'] = otherP.m_logo.url
		data['elo'] = otherP.elo()
	return JsonResponse(data)

def save_move(request,room,move,turn):
	r = Room.objects.get(id=room)
	r.m_turn = turn
	r.m_move = move
	r.save()
	return JsonResponse({})

def send(request):
	type_m = int(request.GET.get('type',None))
	room = Room.objects.get(id=int(request.GET.get('room',None)))
	opponent = 1-type_m
	result = {}
	result['ocu'] = False
	if room.m_send == opponent:
		result['ocu'] = True
		messages = Message.objects.filter(m_sender=opponent,m_room=room,m_status=0)
		result['nb_msg'] = messages.count()
		for i in range(result['nb_msg']):
			result['msg'+str(i)] = messages[i].m_message 
		r.m_send = 2
		r.save()
	room.m_send = type_m
	if type_m in [0,1]:
		message = Message()
		message.m_room = room
		message.m_message = request.GET.get('message',None)
		message.m_sender = int(request.GET.get('sender',None))
		message.save()
	room.save()
	return JsonResponse(result)

def update_stats(request,room,stat,player=-1):
	r = Room.objects.get(id=room)
	r.is_available = 4
	if stat == 1:
		r.stat = 'W'+str(player)	
		if player == 'w':
			r.m_player1.m_wins += 1
			r.m_player2.m_loses += 1
		elif player == 'b':
			r.m_player2.m_wins += 1
			r.m_player1.m_loses += 1
	elif stat == 2:
		r.stat = 'D'
		r.m_player1.m_draws += 1
		r.m_player2.m_draws += 1		
	r.m_player1.save()
	r.m_player2.save()
	r.save()	
	return JsonResponse({})

def check_turn(request,room):
	r = Room.objects.get(id=room)
	data = {'turn':r.m_turn,'move':r.m_move}
	return JsonResponse(data)

def check_response(request,room,turn=-1):
	r = Room.objects.get(id=room)
	data = {}
	data['send'] = r.m_send
	opponent = 1-turn
	if data['send'] == (opponent):
		messages = Message.objects.filter(m_sender=opponent,m_room=r,m_status=0)
		data['nb_msg'] = messages.count()
		for i in range(data['nb_msg']):
			data['msg'+str(i)] = messages[i].m_message 
		messages.delete()
		r.m_send = 2
		r.save()
	return JsonResponse(data)
