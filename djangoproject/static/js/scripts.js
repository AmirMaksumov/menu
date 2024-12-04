// csrftoken
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');


$(document).ready(function() {
    function updateOrderInfo() {
        console.log("--------------")
        $.ajax({
            type: 'GET',
            url: '/order_list_ajax/',
            success: function(data) {
                // Обновляем информацию о заказе на странице
                $('#order-info').html(JSON.stringify(data.order, null, 0));
                console.log("OrderInfoUpdated")
                // Прячем кнопку Remove и количество для позиции и прячем строку "Корзина пуста", если корзина(order) пуста
                $('.remove-from-order').hide()
                $('.position-quantity').hide()
                $('#emptyOrder').hide()
                // Показываем строку "Корзина пуста", если заказ пуст
                if (jQuery.isEmptyObject(data.order)){
                console.log("orderIsEmpty")
                $('#emptyOrder').show()
                }
                // Для каждого элемента в data.order function
                $.each(data.order, function(positionId, quantity) {
                    //Выводим количество позиций
                    $('#quantity-' + positionId).text(quantity)
                    $('#quantityInp-' + positionId).val(quantity)

                    // Прячем кнопки "Подтвердить" и "По количеству"
                    $('#confirmButton-' + positionId).hide();
                    $('#set_quantity_btn-'+ positionId).hide();
                    // Показываем кнопки "Подтвердить" и "По количеству", если навели на поле количества quantityInp
                    $('#quantityInp-' + positionId).focus(function() {
                        $('#confirmButton-' + positionId).show();
                        $('#set_quantity_btn-' + positionId).show();
                        console.log("qweqwe")
                    });

                    // Выводим сумму по позиции
                    var posPrice = ($('.pos_total[data-position-id="' + positionId + '"]').attr('data-position-price'));
                    var posTotal = posPrice * quantity;
                    $('#pos-total-' + positionId).text(posTotal)

                    console.log("totalpos" + positionId + ":" + posTotal)

                    // Показываем количество и кнопку Remove, если позиция есть в заказе
                    if (positionId in data.order){
                        console.log(quantity)
                        console.log("in")
                        $('#remove-from-order-' + positionId).show(); // Показываем кнопку "Remove"
                        $('#position-quantity-' + positionId).show(); // Показываем поле количества
                    }
                });
                console.log("quantityUpdated")
                $('#asd').html(JSON.stringify(data.user_info, null, 0));

                // Выводим общую сумму заказа
                $('#total-cost').text("Заказ / " + data.total_cost + " ₽");
                console.log("TotalCostUpdated")
            },
            error: function() {
                console.log('Error updating order info');
            }
        });
    }

    // Вызываем функцию для обновления информации о заказе при загрузке страницы
    updateOrderInfo();

    $('.updByGQuantity').click(function(e) {
        e.preventDefault();
        console.log("Set All quantity by guests quantity")
         $.ajax({
            type: 'GET',
            url: '/set_quantity_by_guests/',
            success: function(data) {
            if (data.success) {
                    console.log("All quantity updated by guests quantity")
                    updateOrderInfo(); // Обновляем информацию о заказе после добавления позиции
                } else {
                    alert('ahalay mahalay');
                }
            },
            error: function() {
                console.log("Error setting All quantity by guests quantity")
            }
         })
    });

    $('.GetXlsx').click(function(e) {
        e.preventDefault();
        console.log("Xlsx1")
         $.ajax({
            type: 'GET',
            url: '/generate_xlsx/',
            success: function(data) {
            if (data.success) {
                    console.log("Xlsx2")
                    updateOrderInfo(); // Обновляем информацию о заказе после добавления позиции
                } else {
                    alert('owibka xlsx');
                }
            },
            error: function() {
                alert("Введите информацию о мероприятии")
            }
         })
    });

    $('.add-to-order').click(function(e) {
        e.preventDefault();
        console.log('Position added')
        var positionId = $(this).data('position-id');
        $.ajax({
            type: 'POST',
            url: '/add_to_order/'+ positionId + '/',
            data: {'position_id': positionId, 'csrfmiddlewaretoken': csrftoken},
            success: function(data) {
                if (data.success) {
                    updateOrderInfo(); // Обновляем информацию о заказе после добавления позиции
                } else {
                    alert('Error adding position to order');
                }
            },
            error: function() {
                alert('Error adding position to order');
                // Обработка ошибок
            }
        });
    });

    $('.remove-from-order').click(function(e) {
        e.preventDefault();
        var positionId = $(this).data('position-id');
        $.ajax({
            type: 'POST',
            url: '/remove_from_order/'+ positionId + '/',
            data: {'position_id': positionId, 'csrfmiddlewaretoken': csrftoken},
            success: function(data) {
                if (data.success) {
                    console.log('Position removed')
                    if (data.last) {
                        $('#div-' + positionId).remove();
                    }
                    updateOrderInfo(); // Обновляем информацию о заказе после удаления позиции
                } else {
                    alert('Error removing position from order');
                }
            },
            error: function() {
                alert('Error removing position from order');
                // Обработка ошибок
            }
        });
    });

    $('.guestsQuantityBtn').click(function(e) {
        e.preventDefault();
        var guests_quantity = $('#guestsQuantityInput').val();
        console.log(parseInt(guests_quantity) + "asd")
        if (!(guests_quantity === "") && (parseInt(guests_quantity) >= 0)) {

        console.log('Кол-во гостей:' + guests_quantity)
        $.ajax({
            type: 'POST',
            url: '/set_guests_quantity/'+ guests_quantity + '/',
            data: {'guests_quantity': guests_quantity, 'csrfmiddlewaretoken': csrftoken},
            success: function(data) {
                if (data.success) {
                    console.log('Кол-во гостей установлено:' + guests_quantity)
                    updateOrderInfo();
                } else {
                    alert('raz');
                }
            },
            error: function() {
                alert('Ошибка!');
                // Обработка ошибок
            }
        });
        }
    });

    $('.userNameBtn').click(function(e) {
            e.preventDefault();
            var user_name = $('#userNameInp').val();
            console.log("пробуем установить имя")
            if (!(user_name === "")) {
            console.log("пробуем установить имя(не пустое)")
            $.ajax({
                type: 'POST',
                url: '/set_user_name/'+ user_name + '/',
                data: {'user_name': user_name , 'csrfmiddlewaretoken': csrftoken},
                success: function(data) {
                    if (data.success) {
                        console.log('Username установлено: ' + user_name)
                        updateOrderInfo();
                    } else {
                        alert('owibka username');
                    }
                },
                error: function() {
                    alert('Ошибка function username');
                    // Обработка ошибок
                }
            });
            }
        });

    $('.dateOfEventBtn').click(function(e) {
            e.preventDefault();
            var date_of_event = $('#dateOfEvent').val();
            console.log("пробуем установить дату " + date_of_event)
            if (!(date_of_event === "")) {
            console.log("пробуем установить дату(не пустое)")
            $.ajax({
                type: 'POST',
                url: '/set_date_of_event/'+ date_of_event + '/',
                data: {'date_of_event': date_of_event , 'csrfmiddlewaretoken': csrftoken},
                success: function(data) {
                    if (data.success) {
                        console.log('dateOfEvent установлено: ' + date_of_event)
                        updateOrderInfo();
                    } else {
                        alert('owibka dateOfEvent');
                    }
                },
                error: function() {
                    alert('Ошибка function dateOfEvent');
                    // Обработка ошибок
                }
            });
            }
        });

    $('.set_quantity').click(function(e) {
            e.preventDefault();
            console.log('Set quantity by guests quantity')
            var positionId = $(this).data('position-id');
            $.ajax({
                type: 'POST',
                url: '/set_quantity/'+ positionId + '/',
                data: {'position_id': positionId, 'csrfmiddlewaretoken': csrftoken},
                success: function(data) {
                    if (data.success) {
                        console.log("334")
                        updateOrderInfo(); // Обновляем информацию о заказе после добавления позиции
                    } else {
                        alert('Error adding position to order');
                    }
                },
                error: function() {
                    alert('Error adding position to order');
                    // Обработка ошибок
                }
            });
        });

    $('.update_quantity').click(function(e) {
        e.preventDefault();
        console.log('Quantity updated')
        var positionId = $(this).data('position-id');
        var quantity = $('#quantityInp-' + positionId).val();
        if (!(quantity === "") && (parseInt(quantity) >= 0)) {
        $.ajax({
            type: 'POST',
            url: '/update_quantity/'+ positionId + '/' + quantity + '/',
            data: {'position_id': positionId, 'quantity': quantity,'csrfmiddlewaretoken': csrftoken},
            success: function(data) {
                if (data.success) {
                    console.log("334")
                    updateOrderInfo(); // Обновляем информацию о заказе после добавления позиции
                } else {
                    alert('iraz');
                }
            },
            error: function() {
                alert('dvaz');
                // Обработка ошибок
            }
        });
        }
    });

});

/*$(document).ready(function() {
    function updateOrderInfo() {
        $.ajax({
            type: 'GET',
            url: '/order_list_ajax/',
            success: function(data) {
                // Обновляем информацию о заказе на странице
                $('#order-info').html('<pre>' + JSON.stringify(data.order, null, 2) + '</pre>');
            },
            error: function() {
                console.log('Error updating order info');
            }
        });
    }

    // Вызываем функцию для обновления информации о заказе при загрузке страницы
    updateOrderInfo();

    $('.add-to-order').click(function(e) {
        e.preventDefault();
        var positionId = $(this).data('position-id');
        $.ajax({
            type: 'POST',
            url: '/add\_to\_order/' + positionId + '/',
            data: {'csrfmiddlewaretoken': csrftoken},
            success: function(data) {
                if (data.success) {
                    alert('Position added to order');
                    updateOrderInfo(); // Обновляем информацию о заказе после добавления позиции
                } else {
                    alert('Error adding position to order');
                }
            },
            error: function() {
                alert('Error adding position to order');
            }
        });
    });
});*/

// END Django ajax

/*

const add_to_order_url = '/order/add/'
const remove_from_order_url = '/order/remove/'
const order_api_url = '/order/api/'
const added_to_order_class = 'added'

function add_to_order() {
    alert('add to order zapuwen!');
    $('.add-to-order').each((index, el) => {
        $(el).click((e) => {
            e.preventDefault()

            const type = $(el).data('type')
            const id = $(el).data('id')

            if( $(e.target).hasClass(added_to_order_class) ) {
                //console.log ('has class ' + added_to_order_class)
                $.ajax({
                    url: remove_from_order_url,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        type: type,
                        id: id,
                    },
                    success: (data) => {
                        $(el).removeClass(added_to_order_class)
                        // $('form[name="remove-from-order-' + type + '-' + id + '"]').css('display','none')


                    }
                })
            } else {
            //console.log('has NO class ' + added_to_order_class)
                $.ajax({
                    url: add_to_order_url,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        type: type,
                        id: id,
                    },
                    success: (data) => {
                        $(el).addClass(added_to_order_class)
                        // $('form[name="remove-from-order-' + type + '-' + 'id' + '"]').css('display', 'block')


                    }
                })
            }
        })
    })
}

function get_session_order(){

    $.getJSON(order_api_url, (json) => {
        if (json !== null) {
            for (let i = 0; i < json.length; i++) {
                $('.add-to-order').each((index, el) => {
                    const type = $(el).data('type')
                    const id = $(el).data('id')

                    if ( json[i].type == type && json[i].id == id ){
                        $(el).addClass(added_to_order_class)
                    }
                })
            }
        }
    })
}

$(document).ready(function() {
    add_to_order()
    get_session_order()
})*/
