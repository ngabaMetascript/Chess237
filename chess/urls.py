from django.urls import path
from . import views
app_name = 'chess'
urlpatterns = [
   path('',views.index,name = 'index'),
   path('disc/',views.disc,name= 'disc'),
   path('check/',views.check,name = 'check'),
   path('log/',views.log,name = 'log'),
   path('new/',views.new,name = 'new'),
   path('send/',views.send,name = 'send'),
   path('save_move/<int:room>/<str:move>/<int:turn>/',views.save_move,name = 'save_move'),
   path('update_stats/<int:stat>/<int:room>/<str:player>/',views.update_stats,name='update_stats'),
   path('check_turn/<int:room>/',views.check_turn,name = 'check_turn'),
   path('check_response/<int:room>/<int:turn>/',views.check_response,name = 'check_response')
]
