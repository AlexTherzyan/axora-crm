<div class="catalog-section__content">
    <div class="catalog" data-ajax-products>
        {if $products && $products|count > 0}
            {foreach $products as $product}
                {include file="_product.tpl" is_catalog=true}
            {/foreach}
        {else}
            {if !$is_favorites}
                <p>Данный раздел наполняется! Приносим свои извинения.</p>
            {else}
                <p>Товаров нет</p>
            {/if}
        {/if}
    </div>

    {*  если не на странице мзбранных товаров  *}
    {if !$is_favorites}
        <div data-ajax-pagination>
            {include file='pagination.tpl'}
        </div>
    {/if}
</div>