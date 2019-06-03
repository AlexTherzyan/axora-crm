<div class="popup-window">
    <h2 class="popup-window__title">Редактировать данные</h2>

    <form class="js-validation-form-user-edit" method="post">

        <input name="user_id" type="hidden">
        <div class="form-group">
            <label for="accountName">Ваше Ф.И.О.</label>
            <input type="text" class="form-control" id="accountName" name="name" value="" required>
        </div>

        <div class="form-group">
            <label for="accountPhone">Телефон</label>
            <input type="text" class="form-control" id="accountPhone" name="phone" value="" >
        </div>

        <div class="form-group">
            <label for="accountEmail">Электронная почта</label>
            <input type="email" class="form-control" id="accountEmail" name="email" value="" required>
        </div>

        <div class="form-group">
            <label for="accountAddress">Адрес</label>
            <input type="text" class="form-control" id="accountAddress" name="address" value="" >
        </div>

        <br>

        <button type="submit" class="btn btn-info btn-lg">Сохранить</button>
    </form>
</div>


