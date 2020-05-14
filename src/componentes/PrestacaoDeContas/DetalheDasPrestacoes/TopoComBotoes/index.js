import React from "react";
import {CancelarPrestacaoDeContas, SalvarPrestacaoDeContas} from "../../../../utils/Modais";

export const TopoComBotoes = ({handleClickCadastrar, btnCadastrarTexto, showCancelar, showSalvar, onHandleClose, onCancelarTrue, onSalvarTrue,  onShowCancelar, onShowSalvar}) => {

    return (
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='detalhe-das-prestacoes-titulo'>Demonstrativo financeiro da conta cheque</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
                <button onClick={handleClickCadastrar} type="button" className="btn btn-outline-success mr-2 mt-2"><strong>{btnCadastrarTexto}</strong></button>
                <button type="button" onClick={onShowCancelar} className="btn btn-outline-success mr-2 mt-2"><strong>Cancelar</strong></button>
                <button type="button" onClick={onShowSalvar} className="btn btn-outline-success mt-2"><strong>Salvar</strong></button>
                <button disabled="" type="button" className="btn btn-success btn-readonly ml-2 mt-2"><strong>Concluir a conciliação</strong></button>
            </div>

            <section>
                <CancelarPrestacaoDeContas show={showCancelar} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
            <section>
                <SalvarPrestacaoDeContas show={showSalvar} handleClose={onHandleClose} onSalvarTrue={onSalvarTrue}/>
            </section>

        </div>
    );
}