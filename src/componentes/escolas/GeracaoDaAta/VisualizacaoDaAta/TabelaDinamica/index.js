import React from "react";
import {TextoDespesas} from "../TextoDespesas";

export const TabelaDinamica = ({infoAta, valorTemplate}) => {

    if (infoAta && infoAta.contas && infoAta.contas.length > 0) {
        //console.log("TabelaDinamica ", infoAta.contas.length)
        infoAta.contas.map((conta) =>
            //console.log("conta ", conta)
            conta.acoes.map((acao) =>
                console.log("conta ", acao)
            )
        )


    }
    return (
        <>
            {infoAta && infoAta.contas && infoAta.contas.length > 0 && infoAta.contas.map((conta) => {
                    return (
                        conta.acoes && conta.acoes.length > 0 && conta.acoes.map((info) => (
                            <div key={info.acao_associacao_uuid}>
                                <p className='titulo-tabela-acoes mt-5'>
                                    {info.acao_associacao_nome}
                                </p>
                                <table className="table table-bordered tabela-acoes">
                                    <thead>
                                    <tr className="tr-titulo">
                                        <th scope="col">&nbsp;</th>
                                        <th scope="col">Custeio (R$)</th>
                                        <th scope="col">Capital (R$)</th>
                                        <th scope="col">Livre aplicação (R$)</th>
                                        <th scope="col">Total (R$)</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Saldo anterior</td>
                                        <td>{valorTemplate(info.saldo_reprogramado_custeio)}</td>
                                        <td>{valorTemplate(info.saldo_reprogramado_capital)}</td>
                                        <td>{valorTemplate(info.saldo_reprogramado_livre)}</td>
                                        <td>{valorTemplate(info.saldo_reprogramado)}</td>
                                    </tr>
                                    <tr>
                                        <td>Recebimento</td>
                                        <td>{valorTemplate(info.repasses_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.repasses_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.repasses_no_periodo_livre)}</td>
                                        <td>{valorTemplate(info.repasses_no_periodo)}</td>
                                    </tr>
                                    <tr>
                                        <td>Demais créditos (rendimento e outros)</td>
                                        <td>{valorTemplate(info.outras_receitas_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.outras_receitas_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.outras_receitas_no_periodo_livre)}</td>
                                        <td>{valorTemplate(info.outras_receitas_no_periodo)}</td>
                                    </tr>
                                    <tr>
                                        <td>Despesas</td>
                                        <td>{valorTemplate(info.despesas_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.despesas_no_periodo_capital)}</td>
                                        <td className="td-livre-aplicacao-ausente">-</td>
                                        <td>{valorTemplate(info.despesas_no_periodo)}</td>
                                    </tr>
                                    <tr>
                                        <td>Saldo atual</td>
                                        <td>{valorTemplate(info.saldo_atual_custeio)}</td>
                                        <td>{valorTemplate(info.saldo_atual_capital)}</td>
                                        <td>{valorTemplate(info.saldo_atual_livre)}</td>
                                        <td>{valorTemplate(info.saldo_atual_total)}</td>
                                    </tr>
                                    <tr>
                                        <td>Pagamentos a compensar</td>
                                        <td>{valorTemplate(info.despesas_nao_conciliadas_custeio)}</td>
                                        <td>{valorTemplate(info.despesas_nao_conciliadas_capital)}</td>
                                        <td className="td-livre-aplicacao-ausente">-</td>
                                        <td>{valorTemplate(info.despesas_nao_conciliadas)}</td>
                                    </tr>
                                    <tr>
                                        <td>Crédito não demonstrado</td>
                                        <td>{valorTemplate(info.receitas_nao_conciliadas_custeio)}</td>
                                        <td>{valorTemplate(info.receitas_nao_conciliadas_capital)}</td>
                                        <td>{valorTemplate(info.receitas_nao_conciliadas_livre)}</td>
                                        <td>{valorTemplate(info.receitas_nao_conciliadas)}</td>
                                    </tr>
                                    <tr>
                                        <td>Crédito futuros</td>
                                        <td>{valorTemplate(info.repasses_nao_realizados_custeio)}</td>
                                        <td>{valorTemplate(info.repasses_nao_realizados_capital)}</td>
                                        <td>{valorTemplate(info.repasses_nao_realizados_livre)}</td>
                                        <td>{valorTemplate(info.repasses_nao_realizados_custeio + info.repasses_nao_realizados_capital + info.repasses_nao_realizados_livre)}</td>
                                    </tr>
                                    <tr>
                                        <td>Devolução a conta do PTRF</td>
                                        <td>{valorTemplate(info.receitas_devolucao_no_periodo_custeio)}</td>
                                        <td>{valorTemplate(info.receitas_devolucao_no_periodo_capital)}</td>
                                        <td>{valorTemplate(info.receitas_devolucao_no_periodo_livre)}</td>
                                        <td>{valorTemplate(info.receitas_devolucao_no_periodo)}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <TextoDespesas
                                    especificaoesDespesaCusteio={info.especificacoes_despesas_custeio}
                                    especificaoesDespesaCapital={info.especificacoes_despesas_capital}
                                    despesasPeriodoCusteio={info.despesas_no_periodo_custeio}
                                    despesasPeriodoCapital={info.despesas_no_periodo_capital}
                                    valorTemplate={valorTemplate}
                                />
                            </div>
                        ))
                    ) // Return
                }
            )}


        </>
    )
};