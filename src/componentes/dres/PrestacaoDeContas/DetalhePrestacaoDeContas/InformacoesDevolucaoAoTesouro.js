import React, {Fragment} from "react";
import {Formik, FieldArray, Field} from "formik";
import {exibeDataPT_BR, trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {DatePickerField} from "../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";

export const InformacoesDevolucaoAoTesouro = (
    {
        formRef,
        informacoesPrestacaoDeContas,
        initialValues,
        despesas,
        buscaDespesaPorFiltros,
        valorTemplate,
        despesasTabelas,
        tiposDevolucao,
    }) =>{
    console.log("InformacoesDevolucaoAoTesouro ", despesasTabelas)

    return(
        <>
            {informacoesPrestacaoDeContas && informacoesPrestacaoDeContas.devolucao_ao_tesouro === "Sim" &&
            <>
                <h1>devolucaoAoTesouro</h1>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    //onSubmit={metodoSalvarAnalise}
                    innerRef={formRef}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                            resetForm,
                            errors,
                        } = props;

                        return (
                            <form>

                                <FieldArray
                                    name="devolucoes_ao_tesouro"
                                    render={({remove, push}) => (
                                        <>
                                            {values.devolucoes_ao_tesouro && values.devolucoes_ao_tesouro.length > 0 && values.devolucoes_ao_tesouro.map((devolucao, index) => {
                                                return (
                                                    <div className="row" key={index}>

                                                        <div className={`col-12 mt-3`}>
                                                            <p className="mb-0">
                                                                <strong>Devolução {index + 1}</strong>
                                                            </p>
                                                            <hr className="mt-0 mb-1"/>
                                                        </div>


                                                        <div className="col-12 col mt-2">
                                                            <div className='row'>
                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_cpf_cnpj">Busque por CNPJ ou CPF</label>

                                                                    <input
                                                                        name={`devolucoes_ao_tesouro[${index}].busca_por_cpf_cnpj`}
                                                                        value={devolucao.busca_por_cpf_cnpj}
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }
                                                                        }
                                                                        type="text"
                                                                        className='form-control'
                                                                        placeholder="Digite o nº do CNPJ ou CPF"
                                                                    />
                                                                </div>

                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_tipo_documento">Busque por tipo de documento</label>

                                                                    <select
                                                                        name={`devolucoes_ao_tesouro[${index}].busca_por_tipo_documento`}
                                                                        value={devolucao.busca_por_tipo_documento}
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }
                                                                        }
                                                                        className='form-control'
                                                                    >
                                                                        <option value="">Selecione o tipo</option>
                                                                        {despesasTabelas.tipos_documento && despesasTabelas.tipos_documento.map(item =>
                                                                            <option key={item.id} value={item.id}>{item.nome}</option>
                                                                        )
                                                                        }

                                                                    </select>
                                                                </div>

                                                                <div className='col'>
                                                                    <label className='labels-filtros' htmlFor="busca_por_numero_documento">Busque por número do documento</label>
                                                                    <input
                                                                        name={`devolucoes_ao_tesouro[${index}].busca_por_numero_documento`}
                                                                        value={devolucao.busca_por_numero_documento}
                                                                        onChange={async (e) => {
                                                                            props.handleChange(e);
                                                                        }
                                                                        }
                                                                        type="text"
                                                                        className='form-control'
                                                                        //placeholder=""
                                                                    />
                                                                </div>
                                                                <div className='col-12 text-right'>
                                                                    <button name='btnFiltrar' type='button' onClick={()=>buscaDespesaPorFiltros(index)} className='btn btn-success mt-2'>Filtrar</button>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className='col-12 mt-3 mb-4'>
                                                            <div className='col-12 py-2 container-tabela-despesas'>
                                                                <table className={`table tabela-despesas mb-0 ${despesas && eval('despesas.devolucao_'+index) && eval('despesas.devolucao_'+index).length > 0 ? 'table-bordered' : ''}`}>
                                                                    <tbody>

                                                                    {despesas && eval('despesas.devolucao_'+index) && eval('despesas.devolucao_'+index).length > 0 ?

                                                                        eval('despesas.devolucao_'+index).map((despesa, index_interno)=>

                                                                            <Fragment key={index_interno}>
                                                                                <tr className='divisao'>
                                                                                    <td className='td-com-despesas'><Field type="radio" name={`devolucoes_ao_tesouro[${index}].despesa_uuid`} value={despesa.uuid} /></td>
                                                                                    <td className='td-com-despesas'>{despesa.nome_fornecedor}</td>
                                                                                    <td className='td-com-despesas'>{despesa.cpf_cnpj_fornecedor}</td>
                                                                                    <td className='td-com-despesas'>{despesa.tipo_documento && despesa.tipo_documento.nome ? despesa.tipo_documento.nome : ''}</td>
                                                                                    <td className='td-com-despesas'>{despesa.numero_documento}</td>
                                                                                    <td className='td-com-despesas'>R$ {valorTemplate(despesa.valor_total)}</td>
                                                                                    <td className='td-com-despesas'>{despesa.data_documento ? exibeDataPT_BR(despesa.data_documento) : ''}</td>
                                                                                </tr>
                                                                            </Fragment>
                                                                        ):
                                                                        <tr>
                                                                            <td className='td-sem-despesas'><p className='mb-3'>Não existem itens para essa pesquisa</p></td>
                                                                        </tr>
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>

                                                        <div className='col-12 col-md-9 mt-2'>
                                                            <div className="form-group">
                                                                <label htmlFor="tipo_devolucao">Tipo de devolução</label>

                                                                <select
                                                                    name={`devolucoes_ao_tesouro[${index}].tipo_devolucao`}
                                                                    value={devolucao.tipo_devolucao}
                                                                    onChange={async (e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                    className='form-control'
                                                                >
                                                                    <option value="">Selecione o tipo</option>
                                                                    {tiposDevolucao && tiposDevolucao.map(item =>
                                                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                                                    )
                                                                    }
                                                                 </select>
                                                                {props.errors.tipo_devolucao && <span className="text-danger mt-1">{props.errors.tipo_devolucao}</span>}
                                                            </div>
                                                        </div>

                                                        <div className='col-12 col-md-3 mt-2'>
                                                            <div className="form-group">
                                                                <label htmlFor="data">Data da devolução</label>
                                                                <DatePickerField
                                                                    name={`devolucoes_ao_tesouro[${index}].data`}
                                                                    value={devolucao.data}
                                                                    onChange={setFieldValue}
                                                                />
                                                                {props.errors.data && <span className="text-danger mt-1">{props.errors.data}</span>}
                                                            </div>
                                                        </div>

                                                        <div className='col-12 col-md-6'>
                                                                <label className='labels-filtros' htmlFor="valor_total_parcial">Valor total ou parcial da despesa</label>
                                                                 <select
                                                                    name={`devolucoes_ao_tesouro[${index}].valor_total_parcial`}
                                                                    value={devolucao.valor_total_parcial}
                                                                    onChange={async (e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                    className='form-control'
                                                                >
                                                                    <option value="">Selecione o tipo</option>
                                                                    <option value={true}>Valor total</option>
                                                                    <option value={false}>Valor parcial</option>
                                                                </select>
                                                        </div>

                                                        <div className='col-12 col-md-6'>
                                                            <label className='labels-filtros' htmlFor="valor">Valor</label>
                                                            <CurrencyInput
                                                                allowNegative={false}
                                                                prefix='R$'
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                value={devolucao.valor}
                                                                name={`devolucoes_ao_tesouro[${index}].valor`}
                                                                onChangeEvent={(e) => {
                                                                    props.handleChange(e);
                                                                }}
                                                                className={`form-control`}
                                                                selectAllOnFocus={true}
                                                            />
                                                        </div>


                                                        {index >= 1 && values.devolucoes_ao_tesouro.length > 1 && (
                                                            <div className='col-12'>
                                                                <div className="d-flex  justify-content-start mt-2 mb-3">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn btn-outline-success mr-2"
                                                                        onClick={async () => {
                                                                            await remove(index)
                                                                        }}

                                                                    >
                                                                        - Remover Despesa
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                    </div>

                                                )
                                            })}
                                            <div className="d-flex justify-content-start mt-2 mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn btn-success mr-2"
                                                    onClick={async () =>  {
                                                        push(
                                                            {
                                                                busca_por_cpf_cnpj: "",
                                                                busca_por_tipo_documento: "",
                                                                busca_por_numero_documento: "",
                                                                despesa_uuid: "",
                                                                tipo_devolucao: "",
                                                                data: "",
                                                                valor_total_parcial: "",
                                                                valor: "",
                                                            }
                                                        );
                                                    }}
                                                >
                                                    + Adicionar outra devolução
                                                </button>
                                            </div>
                                        </>
                                    )}
                                >
                                </FieldArray>
                            </form>
                        )
                    }}
                </Formik>
            </>
            }

        </>
    )
};