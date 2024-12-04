from django.shortcuts import render

from menu.models import Position, Category


# Create your views here.


def menu_page(request):
    user_info = request.session.get('user_info', {})
    context = {
        "position_list": Position.objects.all(),
        "pos_by_cat": Category.objects.prefetch_related('positions'),
        "category_list": Category.objects.all(),
        "user_info": user_info
    }
    return render(request, 'menu.html', context=context)
