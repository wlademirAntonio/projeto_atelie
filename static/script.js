$(document).ready(function() {

    var carrinho = []

    $('#input').on('keydown', function(e) {
        if (e.key == 'Enter') {
            var cod = $('#input').val()
            $('#input').val('')

            $.ajax({
                type: 'POST',
                dataType: 'json',
                assync: true,
                data: {'cod': cod},
                url: '/busca',
                success: function(dados) {
                    if (dados.message == 'not exist' && modalCadastro.style.display != 'flex') {
                        modalCadastro.style.display = 'flex'
                        inputCod.value = cod
                    }
                    if (dados.message == 'exist') {
                        var rep = false
                        carrinho.forEach(e => {
                            if (e.includes(dados.info[1])) {
                                rep = true
                                e[5] += 1
                            }
                        })
                        if (!rep) {
                            dados.info.push(1)
                            carrinho.push(dados.info)
                        }
                    }
                    produtosCompra.innerHTML = ''
                    carrinho.forEach(e => {
                        $('#produtosCompra').append(`
                            
                                <div class="produto">
                                    <div class="cod">
                                        <p class="legenda">Código</p>
                                        <p class="texto">${e[1]}</p>
                                    </div>
                                    <div class="marca">
                                        <p class="legenda">Marca</p>
                                        <p class="texto">${e[2]}</p>
                                    </div>
                                    <div class="nome">
                                        <p class="legenda">Nome do produto</p>
                                        <p class="texto">${e[3]}</p>
                                    </div class="quant">
                                    <div class="quant">
                                        <p class="legenda">Quant.</p>
                                        <p class="texto">${e[5]}</p>
                                    </div>
                                    <div class="preco">
                                        <p class="legenda">Preço</p>
                                        <p class="texto">R$ ${parseFloat(e[4]).toFixed(2)}</p>
                                    </div>
                                    <div class="total-produto">
                                        <p class="legenda">Total</p>
                                        <p class="texto">R$ ${parseFloat(e[4]*e[5]).toFixed(2)}</p>
                                    </div>
                                    <div class="remover">
                                        <button class="btn-remover" id="${e[0]}">&times;</button>
                                    </div>
                                </div>
                        
                            `)
                    })
                    total()
                }
            })
        }
    })

    $(document).on('click', '.btn-remover', function(e) {
        e.preventDefault()
        
        const id = e.target.id

        carrinho = carrinho.filter(item => item[0] != id)
        $(this).closest('.produto').remove()

        total()
    })

    $('#sairModal').click(function(e) {
        e.preventDefault()
        modalCadastro.style.display = 'none'
        inputCod.value = ''
        inputMarca.value = ''
        inputNome.value = ''
        inputPreco.value = ''
        inputQuantidade.value = ''
    });

    $('#btnCadastrar').click(function(e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            dataType: 'json',
            assync: true,
            data: {'cod': inputCod.value, 'marca': inputMarca.value, 'nome': inputNome.value, 'preco': inputPreco.value, 'quantidade': inputQuantidade.value},
            url: '/cadastro',
            success: function(dados) {
                $('.form-cadastro').append(`
                    <div class="spam-cadastro">
                    <p>${dados.message}</p>
                    </div>  
                `)
                setTimeout(() => {
                    $('.spam-cadastro').remove()
                    if (dados.type == 'success') {
                        modalCadastro.style.display = 'none'
                        inputMarca.value = ''
                        inputCod.value = ''
                        inputNome.value = ''
                        inputPreco.value = ''
                        inputQuantidade.value = ''
                    }
                }, 2500)
            }
        })
    })

    $('#inputPreco').keydown(function(e) {
        if (!Number(e.key) && e.key != ',' && e.key != 0 && e.key != 'Backspace') {
            e.preventDefault()
        }
    })

    $('#inputQuantidade').keydown(function(e) {
        if (!Number(e.key) && e.key != 0 && e.key != 'Backspace') {
            e.preventDefault()
        }
    })

    $('#limpar').click(function(e) {
        e.preventDefault()
        carrinho = []
        produtosCompra.innerHTML = ''
        inputRecebido.value = ''
        inputTroco.value = ''
        inputTotal.value = ''
    })

    function total() {
        var total = 0
        carrinho.forEach(e => {
            total += e[4] * e[5]
        });

        if (total <= 0) {
            total = ''
        }

        inputTotal.value = total
        inputRecebido.value = total
        inputTroco.value = ''
    }

    $('#inputRecebido').keydown(function(e) {
        if (e.key == 'Enter') {
            inputTroco.value = inputRecebido.value - inputTotal.value
        }
    })
})