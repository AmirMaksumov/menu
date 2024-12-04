from django.urls import path, include

from .views import (delete_order, add_to_order, order_list_ajax, remove_from_order, order_page, set_guests_quantity,
                    set_quantity, update_quantity, set_quantity_by_guests, set_user_name, set_date_of_event,
                    generate_xlsx)

app_name = 'order'

urlpatterns = [
    path('add_to_order/<int:position_id>/', add_to_order, name='add'),
    path('remove_from_order/<int:position_id>/', remove_from_order, name='remove'),
    path('delete_order/', delete_order, name='delete'),
    path('order_list_ajax/', order_list_ajax, name='list_ajax'),
    path('order/', order_page, name='order_page'),
    path('set_guests_quantity/<int:guests_quantity>/', set_guests_quantity, name='set_g_quantity'),
    path('set_quantity/<int:position_id>/', set_quantity, name='set_quantity'),
    path('update_quantity/<int:position_id>/<int:quantity>/', update_quantity, name='update_quantity'),
    path('set_quantity_by_guests/', set_quantity_by_guests, name='set_quantity_by_guests'),
    path('set_user_name/<user_name>/', set_user_name, name='set_user_name'),
    path('set_date_of_event/<date_of_event>/', set_date_of_event, name="set_date_of_event"),
    path('generate_xlsx/', generate_xlsx, name="xlsx")
]

