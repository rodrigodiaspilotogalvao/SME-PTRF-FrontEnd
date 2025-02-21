import React, {memo} from "react";
import {FieldArray, Formik} from "formik";
import {YupSignupSchemaDetalharAcertosDocumentos} from './YupSignupSchemaDetalharAcertosDocumentos'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle, faExclamationCircle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";

const FormularioAcertos = ({solicitacoes_acerto, onSubmitFormAcertos, formRef, tiposDeAcertoDocumentosAgrupados, handleChangeTipoDeAcertoDocumento, textoCategoria, corTextoCategoria, adicionaTextoECorCategoriaVazio, removeTextoECorCategoriaTipoDeAcertoJaCadastrado, ehSolicitacaoCopiada}) =>{

    const categoriaNaoPodeRepetir = (categoria) => {
        if(categoria.id === 'SOLICITACAO_ESCLARECIMENTO'){
            return true;
        }

        return false;
    }

    const itemDaCategoriaPodeRepetir = (categoria) => {
        if(categoria.id === 'INCLUSAO_CREDITO'){
            return true;
        }
        else if(categoria.id === 'INCLUSAO_GASTO'){
            return true;
        }

        return false;
    }

    const categoriaNaoTemItensParaExibir = (categoria) => {
        let itens_a_exibir = categoria.tipos_acerto_documento.filter((item) => (item.deve_exibir === true));

        if(itens_a_exibir.length === 0){
            return true;
        }

        return false;
    }

    const opcoesSelect = (acertos) => {
        for(let index_categoria=0; index_categoria <= tiposDeAcertoDocumentosAgrupados.length -1; index_categoria ++){
            let categoria = tiposDeAcertoDocumentosAgrupados[index_categoria]
            categoria.deve_exibir_categoria = true;

            for(let index_tipo_acerto=0; index_tipo_acerto <= categoria.tipos_acerto_documento.length -1; index_tipo_acerto++){
                let acerto = categoria.tipos_acerto_documento[index_tipo_acerto];
                let uuid = acerto.uuid
                acerto.deve_exibir = true

                let ja_selecionado = acertos.filter((item) => (item.tipo_acerto === uuid))

                if(ja_selecionado.length > 0){

                    if(!itemDaCategoriaPodeRepetir(categoria)){
                        acerto.deve_exibir = false
                    }

                    if(categoriaNaoPodeRepetir(categoria) || categoriaNaoTemItensParaExibir(categoria)){
                        categoria.deve_exibir_categoria = false;
                    }  
                }
            }
        }

        return tiposDeAcertoDocumentosAgrupados
    }


    return(
        <div className='mt-3'>
            <Formik
                initialValues={solicitacoes_acerto}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={YupSignupSchemaDetalharAcertosDocumentos}
                onSubmit={onSubmitFormAcertos}
                innerRef={formRef}
            >
                {props => {
                    const {
                        values,
                        errors
                    } = props;
                    return (
                        <>
                            <form onSubmit={props.handleSubmit}>
                                <FieldArray
                                    name="solicitacoes_acerto"
                                    render={({remove, push}) => (
                                        <>
                                            {values.solicitacoes_acerto && values.solicitacoes_acerto.length > 0 && values.solicitacoes_acerto.map((acerto, index, acertos) => {
                                                return (
                                                    <div key={index}>
                                                        <div
                                                            className='d-flex justify-content-between titulo-row-expanded-conferencia-de-lancamentos mt-4'>
                                                            <p className='mb-0 font-weight-bold'>
                                                                <strong>Item {index + 1}</strong></p>
                                                            <button
                                                                type="button"
                                                                className={`btn btn-link ${ehSolicitacaoCopiada(acerto) ? 'btn-remover-ajuste-documento-copia' : 'btn-remover-ajuste-documento'} mr-2 p-0 d-flex align-items-center`}
                                                                onClick={() => {
                                                                    remove(index)
                                                                    removeTextoECorCategoriaTipoDeAcertoJaCadastrado(index)
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    style={{
                                                                        fontSize: '17px',
                                                                        marginRight: "4px",
                                                                        color: ehSolicitacaoCopiada(acerto) ? "#297805" : "#B40C02"
                                                                    }}
                                                                    icon={ ehSolicitacaoCopiada(acerto) ? faCheckCircle : faTimesCircle }
                                                                />
                                                                { ehSolicitacaoCopiada(acerto) ? "Considerar correto" : "Remover item" }
                                                            </button>
                                                        </div>

                                                        <div className="form-row container-campos-dinamicos">
                                                            <div className="col-12 mt-4">
                                                                <label htmlFor={`tipo_acerto_[${index}]`}>Tipo de acerto</label>
                                                                <select
                                                                    value={acerto.tipo_acerto}
                                                                    name={`solicitacoes_acerto[${index}].tipo_acerto`}
                                                                    id={`tipo_acerto_[${index}]`}
                                                                    className="form-control"
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                        handleChangeTipoDeAcertoDocumento(e, index);
                                                                    }}
                                                                    disabled={acerto.uuid ? true : false}
                                                                >
                                                                    <option key='' value="">Selecione a especificação do acerto</option>
                                                                    {tiposDeAcertoDocumentosAgrupados && tiposDeAcertoDocumentosAgrupados.length > 0 && opcoesSelect(acertos).map(item => (
                                                                        <optgroup key={item.id} label={item.nome} className={!item.deve_exibir_categoria ? 'esconde-categoria' : ''}>
                                                                            {item.tipos_acerto_documento && item.tipos_acerto_documento.length > 0 && item.tipos_acerto_documento.map(tipo_acerto => (
                                                                                <option className={!tipo_acerto.deve_exibir ? 'esconde-tipo-acerto' : ''} key={tipo_acerto.uuid} value={tipo_acerto.uuid} data-categoria={item.id}>{tipo_acerto.nome}</option>
                                                                            ))}
                                                                        </optgroup>
                                                                    ))}
                                                                </select>
                                                                <p className='mt-1 mb-0'><span className="text-danger">{errors && errors.solicitacoes_acerto && errors.solicitacoes_acerto[index] && errors.solicitacoes_acerto[index].tipo_acerto ? errors.solicitacoes_acerto[index].tipo_acerto : ''}</span></p>
                                                                {textoCategoria[index] &&
                                                                    <p className='mt-2 mb-0'>
                                                                        <FontAwesomeIcon
                                                                            style={{fontSize: '17px', marginRight:'4px'}}
                                                                            icon={faExclamationCircle}
                                                                            className={corTextoCategoria[index]}
                                                                        />

                                                                        <span className={corTextoCategoria[index]}>{textoCategoria[index]}</span>
                                                                    </p>
                                                                }
                                                            </div>

                                                            <div className="col-12 mt-3">
                                                                <label htmlFor={`form-control[${index}]`}>Detalhamento do acerto (opcional)</label>
                                                                <textarea
                                                                    value={acerto.detalhamento}
                                                                    name={`solicitacoes_acerto[${index}].detalhamento`}
                                                                    id={`detalhamento[${index}]`}
                                                                    className="form-control"
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                    }}
                                                                    placeholder={'Utilize esse campo para detalhar o motivo'}
                                                                />
                                                            </div>

                                                        </div>
                                                    </div> /*div key*/
                                                )
                                            })}

                                            <div className="d-flex  justify-content-start mt-3 mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn btn-outline-success mt-2 mr-2"
                                                    onClick={() => {
                                                        push({
                                                            uuid: null,
                                                            copiado: false,
                                                            tipo_acerto: '',
                                                            detalhamento: '',
                                                        });
                                                        adicionaTextoECorCategoriaVazio();
                                                    }}
                                                >
                                                    + Adicionar novo item
                                                </button>
                                            </div>
                                        </>
                                    )}
                                />
                            </form>
                        </>
                    )
                }}
            </Formik>
        </div>
    )
}
export default memo(FormularioAcertos)