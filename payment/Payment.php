<?PHP

namespace Payment;

use Api\Simpla;

class PaymentModule extends Simpla
{
 
	public function checkout_form()
	{
		$form = '<input type=submit value="Оплатить" class="basket-footer__button btn btn-info">';
		return $form;
	}
	public function settings()
	{
		$form = '<input type=submit value="Оплатить" class="basket-footer__button btn btn-info">';
		return $form;
	}
}
