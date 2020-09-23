import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {getPeriodos} from "../../../../services/dres/Dashboard.service";
import {TopoSelectPeriodoBotaoVoltar} from "./TopoSelectPeriodoBotaoVoltar";
import {getPrestacoesDeContas, getQtdeUnidadesDre} from "../../../../services/dres/PrestacaoDeContas.service";
import {BarraDeStatus} from "./BarraDeStatus";
import {FormFiltros} from "./FormFiltros";
import "../prestacao-de-contas.scss"
import {getTabelaAssociacoes} from "../../../../services/dres/Associacoes.service";
import moment from "moment";
import {TabelaDinamica} from "./TabelaDinamica";

export const ListaPrestacaoDeContas= () => {

    let {periodo_uuid, status_prestacao} = useParams();

    const initialStateFiltros = {
        filtrar_por_termo: "",
        filtrar_por_tipo_de_unidade: "",
        filtrar_por_status: "",
        filtrar_por_tecnico_atribuido: "",
        filtrar_por_data_inicio: "",
        filtrar_por_data_fim: "",
    };

    const [periodos, setPeriodos] = useState(false);
    const [periodoEscolhido, setPeriodoEsolhido] = useState(false);
    const [statusPrestacao, setStatusPrestacao] = useState("");
    const [prestacaoDeContas, setPrestacaoDeContas] = useState(false);
    const [qtdeUnidadesDre, setQtdeUnidadesDre] = useState(false);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);
    const [toggleMaisFiltros, setToggleMaisFiltros] = useState(false);

    useEffect(() => {
        carregaPeriodos();
        carregaStatus();
        carregaQtdeUnidadesDre();
        buscaTabelaAssociacoes();
    }, []);


    useEffect(() => {
        carregaPrestacoesDeContas();
    }, [periodoEscolhido]);

    useEffect(() => {
        carregaPrestacoesDeContas();
    }, [statusPrestacao]);


    const carregaPeriodos = async () => {
        let periodos = await getPeriodos();
        setPeriodos(periodos);
        if (periodo_uuid){
            setPeriodoEsolhido(periodo_uuid)
        }else if (periodos && periodos.length > 0){
            setPeriodoEsolhido(periodos[0].uuid)
        }
    };

    const carregaStatus = async  ()=>{
        if (status_prestacao !== undefined){
            setStatusPrestacao(status_prestacao)
            setStateFiltros({
                ...stateFiltros,
                filtrar_por_status: status_prestacao
            });
        }
    }

    const carregaPrestacoesDeContas = async ()=>{
        if (periodoEscolhido){
            let data_inicio = stateFiltros.filtrar_por_data_inicio ? moment(new Date(stateFiltros.filtrar_por_data_inicio), "YYYY-MM-DD").format("YYYY-MM-DD") : "";
            let data_fim = stateFiltros.filtrar_por_data_fim ? moment(new Date(stateFiltros.filtrar_por_data_fim), "YYYY-MM-DD").format("YYYY-MM-DD") : '';

            let prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido, stateFiltros.filtrar_por_termo, stateFiltros.filtrar_por_tipo_de_unidade, stateFiltros.filtrar_por_status);
            setPrestacaoDeContas(prestacoes_de_contas)
        }
    };

    const carregaPrestacoesDeContasPorDrePeriodo = async ()=>{
        let prestacoes_de_contas = await getPrestacoesDeContas(periodoEscolhido);
        setPrestacaoDeContas(prestacoes_de_contas)
    };

    const carregaQtdeUnidadesDre = async () =>{
        let qtde_unidades = await getQtdeUnidadesDre();
        setQtdeUnidadesDre(qtde_unidades.qtd_unidades)
    };

    const buscaTabelaAssociacoes = async ()=>{
        let tabela_associacoes = await getTabelaAssociacoes();
        setTabelaAssociacoes(tabela_associacoes);
    };

    const exibeLabelStatus = ()=>{

        if (statusPrestacao === 'NAO_RECEBIDA'){
            return 'não recebidas'
        }else if (statusPrestacao === 'RECEBIDA'){
            return 'recebidas'
        }else if (statusPrestacao === 'EM_ANALISE'){
            return 'em análise'
        }else if (statusPrestacao === 'DEVOLVIDA'){
            return 'devolvidas para acerto'
        }else if (statusPrestacao === 'APROVADA'){
            return 'aprovadas'
        }else if (statusPrestacao === 'REPROVADA'){
            return 'reprovadas'
        }else {
            return 'SEM STATUS'
        }
    };


    const handleChangePeriodos = async (uuid_periodo) => {
        setPeriodoEsolhido(uuid_periodo)
    };

    const handleChangeFiltros = (name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    };

    const handleSubmitFiltros = async (event)=>{
        console.log("handleSubmitFiltros ", stateFiltros)

        event.preventDefault();
        setStatusPrestacao(stateFiltros.filtrar_por_status);
        await carregaPrestacoesDeContas();
    };

    const limpaFiltros = async () => {
        await setStateFiltros(initialStateFiltros);
        await setStatusPrestacao('');
        await carregaPrestacoesDeContasPorDrePeriodo();
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <TopoSelectPeriodoBotaoVoltar
                    periodos={periodos}
                    periodoEscolhido={periodoEscolhido}
                    handleChangePeriodos={handleChangePeriodos}
                />
                <BarraDeStatus
                    qtdeUnidadesDre={qtdeUnidadesDre}
                    prestacaoDeContas={prestacaoDeContas}
                    statusDasPrestacoes={exibeLabelStatus(statusPrestacao)}
                />

                <p className='titulo-explicativo mt-4 mb-4'>Prestações de contas pendentes de análise e recebimento</p>

                <FormFiltros
                    stateFiltros={stateFiltros}
                    tabelaAssociacoes={tabelaAssociacoes}
                    handleChangeFiltros={handleChangeFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                    limpaFiltros={limpaFiltros}
                    toggleMaisFiltros={toggleMaisFiltros}
                    setToggleMaisFiltros={setToggleMaisFiltros}
                />

                {prestacaoDeContas && prestacaoDeContas.length > 0 &&
                    <TabelaDinamica
                        prestacaoDeContas={prestacaoDeContas}
                    />
                }

            </div>
        </PaginasContainer>
    )
};