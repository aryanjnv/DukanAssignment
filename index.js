function handleFormSubmit(event) {
    event.preventDefault();

    var itemname = document.getElementById('itemname').value;
    var description = document.getElementById('description').value;
    var price = document.getElementById('price').value;
    var quantity = document.getElementById('quantity').value;

    var itemDetails = {
        itemname: itemname,
        description: description,
        price: price,
        quantity:quantity
    };
    axios.post('https://crudcrud.com/api/2fc608b49ece42b983fd892b7d49aebd/item', itemDetails)
        .then(function (response) {
            console.log('Data stored in the cloud:', response.data);
        })
        .catch(function (error) {
            console.error('Error storing data in the cloud:', error);
        });
    document.getElementById('itemname').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
    initUI();
}

function initUI() {
    axios.get('https://crudcrud.com/api/2fc608b49ece42b983fd892b7d49aebd/item')
        .then(function (response) {
            var userDetailsArray = response.data;

            var userItem = document.getElementById('userItem');
            userItem.innerHTML = ''; 

            userDetailsArray.forEach(function (itemDetails) {
                var listItem = document.createElement('li');

                listItem.textContent = `Itemname: ${itemDetails.itemname}, Description: ${itemDetails.description}, Price: ${itemDetails.price} , Quantity: ${itemDetails.quantity}`;


                var buyButton1 = document.createElement('button');
                buyButton1.innerHTML = 'Buy 1';
                buyButton1.style.cursor = 'pointer';
                buyButton1.onclick = function () {
                    buy(itemDetails._id,1);
                };

                var buyButton2 = document.createElement('button');
                buyButton2.innerHTML = 'Buy 2';
                buyButton2.style.cursor = 'pointer';
                buyButton2.onclick = function () {
                    buy(itemDetails._id,2);
                };

                var buyButton3 = document.createElement('button');
                buyButton3.innerHTML = 'Buy 3';
                buyButton3.style.cursor = 'pointer';
                buyButton3.onclick = function () {
                    buy(itemDetails._id,3);
                };

                listItem.appendChild(buyButton1);
                listItem.appendChild(buyButton2);
                listItem.appendChild(buyButton3);
                
                userItem.appendChild(listItem);
            });
        })
        .catch(function (error) {
            
            console.error('Error fetching data from the cloud:', error);
        });
}

function buy(itemId, no) {
    axios.get(`https://crudcrud.com/api/2fc608b49ece42b983fd892b7d49aebd/item/${itemId}`)
        .then(function (response) {
            var currentItem = response.data;
            var updatedQuantity = currentItem.quantity - no;

            var newItemDetails = {
                itemname: currentItem.itemname,
                description: currentItem.description,
                price: currentItem.price,
                quantity: updatedQuantity
            };

            axios.post('https://crudcrud.com/api/2fc608b49ece42b983fd892b7d49aebd/item', newItemDetails)
                .then(function (insertResponse) {
                    console.log('New item inserted in the cloud:', insertResponse.data);

                    axios.delete(`https://crudcrud.com/api/2fc608b49ece42b983fd892b7d49aebd/item/${itemId}`)
                        .then(function (deleteResponse) {
                            console.log('Previous item deleted from the cloud:', deleteResponse.data);

                            initUI();
                        })
                        .catch(function (deleteError) {
                            console.error('Error deleting previous item from the cloud:', deleteError);
                        });
                })
                .catch(function (insertError) {
                    console.error('Error inserting new item in the cloud:', insertError);
                });
        })
        .catch(function (error) {
            console.error('Error fetching item details from the cloud:', error);
        });
        initUI();
}


document.addEventListener('DOMContentLoaded', function () {
    initUI();
});

