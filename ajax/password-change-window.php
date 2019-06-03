<div class="popup-window">
    <h2 class="popup-window__title">Изменить пароль</h2>

    <form class="js-validation-form-user-password-edit" method="post">
<!--        <div class="form-group">-->
<!--            <label for="accountOldPassword">Старый пароль</label>-->
<!--            <input type="password" class="form-control" id="accountOldPassword" name="accountOldPassword" required>-->
<!--        </div>-->
        <input name="user_id" type="hidden">

        <div class="form-group">
            <label for="accountPassword">Новый пароль</label>
            <input type="password" class="form-control" id="accountPassword" name="password" required>
        </div>

        <div class="form-group">
            <label for="accountRePassword">Повторить новый пароль</label>
            <input type="password" class="form-control" id="accountRePassword" name="accountRePassword" equalTo="#accountPassword" required>
        </div>

        <br>

        <button type="submit" class="btn btn-info btn-lg">Сохранить</button>
    </form>
</div>