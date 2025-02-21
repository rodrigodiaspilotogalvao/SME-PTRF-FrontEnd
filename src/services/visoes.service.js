import {
    USUARIO_LOGIN,
    ASSOCIACAO_UUID,
    ASSOCIACAO_TIPO_ESCOLA,
    ASSOCIACAO_NOME_ESCOLA,
    ASSOCIACAO_NOME,
    authService, DATA_LOGIN, PERIODO_RELATORIO_CONSOLIDADO_DRE
} from "./auth.service";
import {redirect} from "../utils/redirect";
import moment from "moment";
import {ACOMPANHAMENTO_DE_PC} from "./mantemEstadoAcompanhamentoDePc.service";
import { ANALISE_DRE } from './mantemEstadoAnaliseDre.service';

export const DADOS_USUARIO_LOGADO = "DADOS_USUARIO_LOGADO";
export const DATA_HORA_USUARIO_LOGADO = "DATA_HORA_USUARIO_LOGADO";

const forcarNovoLogin = ()=>{
    const data_hora_atual = moment().format("YYYY-MM-DD HH:mm:ss");
    const data_hora_localstorage = localStorage.getItem(DATA_HORA_USUARIO_LOGADO);
    if(data_hora_localstorage){
        const diferenca = moment(data_hora_atual).diff(moment(data_hora_localstorage), 'minutes');
        if (diferenca >= 1440){ // Equivale a 24 horas
            localStorage.setItem(DATA_HORA_USUARIO_LOGADO, data_hora_atual);
            localStorage.removeItem('DADOS_USUARIO_LOGADO');
            localStorage.removeItem(ACOMPANHAMENTO_DE_PC);
            localStorage.removeItem(ANALISE_DRE);
            localStorage.removeItem(PERIODO_RELATORIO_CONSOLIDADO_DRE);
            localStorage.setItem(DATA_LOGIN, moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"));
            authService.logout();
        }else if (diferenca >= 600 && diferenca <= 1339){ // Equivale a 10 horas e menos que 24 horas
            localStorage.setItem(DATA_HORA_USUARIO_LOGADO, data_hora_atual);
            authService.logout();
        }
    }else {
        localStorage.setItem(DATA_HORA_USUARIO_LOGADO, data_hora_atual)
    }
};

const getUsuarioLogin = () => {
    return localStorage.getItem(USUARIO_LOGIN)
};

const getDadosDoUsuarioLogado = () => {
    let dados_usuario_logado = JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO));
    // eslint-disable-next-line no-eval
    return dados_usuario_logado ? eval('dados_usuario_logado.usuario_' + getUsuarioLogin()) : null
};

const setDadosDoUsuarioLogado = (dados_usuario_logado) => {
    let dados_usuario_logado_atual = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let dados_usuario_logado_update = {
        ...dados_usuario_logado_atual,
        [`usuario_${getUsuarioLogin()}`]: {
            ...dados_usuario_logado,
        }
    };
    localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(dados_usuario_logado_update));
};


const setDadosPrimeiroAcesso = async (resp) =>{

    let visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome, notificar_devolucao_referencia, notificar_devolucao_pc_uuid, notificacao_uuid;
    let usuario_logado = getDadosDoUsuarioLogado();

    if (usuario_logado && usuario_logado.associacao_selecionada.uuid){
        visao=usuario_logado.visao_selecionada.nome;
        uuid_unidade = usuario_logado.unidade_selecionada.uuid;
        uuid_associacao = usuario_logado.associacao_selecionada.uuid;
        nome_associacao = usuario_logado.associacao_selecionada.nome;

        // Atualiza as variáveis de informação sobre devolução de PC com as informações da lista de unidades.
        let unidade_update = resp.unidades.find(unidade => unidade.uuid === uuid_unidade);
        if (unidade_update) {
            notificar_devolucao_referencia = unidade_update.notificar_devolucao_referencia;
            notificar_devolucao_pc_uuid = unidade_update.notificar_devolucao_pc_uuid;
            notificacao_uuid = unidade_update.notificacao_uuid;
        } else {
            notificar_devolucao_referencia = usuario_logado.unidade_selecionada.notificar_devolucao_referencia;
            notificar_devolucao_pc_uuid = usuario_logado.unidade_selecionada.notificar_devolucao_pc_uuid;
            notificacao_uuid = usuario_logado.unidade_selecionada.notificacao_uuid;
        }

    }else {
        if (resp.visoes.find(visao=> visao === 'SME') && resp.unidades.find(unidade => unidade.tipo_unidade === "SME")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "SME");
            visao="SME";
            uuid_unidade = unidade.uuid;
            uuid_associacao = unidade.uuid;
            nome_associacao = unidade.nome;
            notificar_devolucao_referencia = null;
            notificar_devolucao_pc_uuid = null;
            notificacao_uuid = null;
        }else if (resp.visoes.find(visao=> visao === 'DRE') && resp.unidades.find(unidade => unidade.tipo_unidade === "DRE")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            visao="DRE";
            uuid_unidade = unidade.uuid;
            uuid_associacao = unidade.uuid;
            nome_associacao = unidade.nome;
            notificar_devolucao_referencia = null;
            notificar_devolucao_pc_uuid = null;
            notificacao_uuid = null;
        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            visao="UE";
            uuid_unidade = unidade.uuid;
            uuid_associacao = unidade.associacao.uuid;
            nome_associacao = unidade.associacao.nome;
            notificar_devolucao_referencia = unidade.notificar_devolucao_referencia;
            notificar_devolucao_pc_uuid = unidade.notificar_devolucao_pc_uuid;
            notificacao_uuid = unidade.notificacao_uuid;
        }
    }

    if (usuario_logado && usuario_logado.unidade_selecionada.nome){
        unidade_nome = usuario_logado.unidade_selecionada.nome;
    }else{
        if (resp.visoes.find(visao=> visao === 'SME') && resp.unidades.find(unidade => unidade.tipo_unidade === "SME")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "SME");
            unidade_nome = unidade.nome;
        }else if (resp.visoes.find(visao=> visao === 'DRE') && resp.unidades.find(unidade => unidade.tipo_unidade === "DRE")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            unidade_nome = unidade.nome;
        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            unidade_nome = unidade.nome;
        }
    }

    if (usuario_logado && usuario_logado.unidade_selecionada.tipo_unidade){
        unidade_tipo = usuario_logado.unidade_selecionada.tipo_unidade;
    }else {
        if (resp.visoes.find(visao=> visao === 'SME') && resp.unidades.find(unidade => unidade.tipo_unidade === "SME")){
            unidade_tipo = "SME";
        }else if (resp.visoes.find(visao=> visao === 'DRE') && resp.unidades.find(unidade => unidade.tipo_unidade === "DRE")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            unidade_tipo = unidade.tipo_unidade;
        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            unidade_tipo = unidade.tipo_unidade;
        }
    }
    alternaVisoes(visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome, notificar_devolucao_referencia, notificar_devolucao_pc_uuid, notificacao_uuid)
};

const getPermissoes = (permissao) =>{

    if (permissao && authService.isLoggedIn()){
        let permissoes = getItemUsuarioLogado('permissoes');
        let result = permissao.filter(item => permissoes.indexOf(item) > -1);
        // let tem_acesso = result.length === permissao.length;
        // Alterado para conceder acesso se tiver ao menos uma das permissões da lista passada.
        // Anteriormente estava exigindo que tivesse todas as permissões passadas na lista o que quebrava o acesso ao perfil de acessos
        let tem_acesso = result.length > 0;
        return tem_acesso
    }

};

const setDadosUsuariosLogados = async (resp) => {

    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let usuario_logado = getDadosDoUsuarioLogado();

    let novos_dados_do_usuario_logado = {
        ...todos_os_dados_usuario_logado,
        [`usuario_${getUsuarioLogin()}`]: {

            usuario_logado: {
                login: resp.login,
                nome: resp.nome
            },
            visoes: resp.visoes,

            visao_selecionada: {
                nome: usuario_logado ? usuario_logado.visao_selecionada.nome : "",
            },
            unidades: resp.unidades,

            unidade_selecionada: {
                uuid: usuario_logado ? usuario_logado.unidade_selecionada.uuid : "",
                tipo_unidade: usuario_logado ? usuario_logado.unidade_selecionada.tipo_unidade : "",
                nome: usuario_logado ? usuario_logado.unidade_selecionada.nome : "",
                notificar_devolucao_referencia: usuario_logado ? usuario_logado.unidade_selecionada.notificar_devolucao_referencia : "",
                notificar_devolucao_pc_uuid: usuario_logado ? usuario_logado.unidade_selecionada.notificar_devolucao_pc_uuid : "",
                notificacao_uuid: usuario_logado ? usuario_logado.unidade_selecionada.notificacao_uuid : "",

            },

            associacao_selecionada: {
                uuid: usuario_logado ? usuario_logado.associacao_selecionada.uuid : "",
                nome: usuario_logado ? usuario_logado.associacao_selecionada.nome : "",
            },

            permissoes: resp.permissoes ? resp.permissoes : []
        }
    };
    localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(novos_dados_do_usuario_logado))
};

const converteNomeVisao = (visao) => {
    if (visao !== "UE" && visao !== "DRE" && visao !== "SME"){
        return "UE"
    }else {
        return visao
    }
};

const alternaVisoes = (visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome, notificar_devolucao_referencia, notificar_devolucao_pc_uuid, notificacao_uuid) => {

    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;
    let dados_usuario_logado = getDadosDoUsuarioLogado();

    if (dados_usuario_logado) {
        let alternar_visao = {
            ...todos_os_dados_usuario_logado,
            [`usuario_${getUsuarioLogin()}`]: {
                ...dados_usuario_logado,
                visao_selecionada: {
                    nome: converteNomeVisao(visao)
                },
                unidade_selecionada: {
                    uuid: uuid_unidade,
                    tipo_unidade:unidade_tipo,
                    nome:unidade_nome,
                    notificar_devolucao_referencia:notificar_devolucao_referencia,
                    notificar_devolucao_pc_uuid:notificar_devolucao_pc_uuid,
                    notificacao_uuid: notificacao_uuid,
                },

                associacao_selecionada: {
                    uuid: uuid_associacao,
                    nome: nome_associacao,
                },
            }
        };
        localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(alternar_visao));
        localStorage.setItem(ASSOCIACAO_UUID, uuid_associacao);
        localStorage.setItem(ASSOCIACAO_NOME,nome_associacao);
        localStorage.setItem(ASSOCIACAO_TIPO_ESCOLA, unidade_tipo);
        localStorage.setItem(ASSOCIACAO_NOME_ESCOLA, unidade_nome);
        localStorage.removeItem('periodoConta');
        localStorage.removeItem('acaoLancamento');
        localStorage.removeItem('periodoPrestacaoDeConta');
        localStorage.removeItem('statusPrestacaoDeConta');
        localStorage.removeItem('contaPrestacaoDeConta');
        localStorage.removeItem('uuidPrestacaoConta');
        localStorage.removeItem('uuidAta');
        localStorage.removeItem('prestacao_de_contas_nao_apresentada');
        localStorage.removeItem(PERIODO_RELATORIO_CONSOLIDADO_DRE);

        localStorage.setItem("NOTIFICAR_DEVOLUCAO_REFERENCIA", notificar_devolucao_referencia)

        redirectVisao(visao)
    }
};


export const setarUnidadeProximoLoginAcessoSuporte = (visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome) => {
    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;
    let dados_usuario_logado = getDadosDoUsuarioLogado();

    if (dados_usuario_logado) {
        let novos_dados_usuario_logado = {
            ...todos_os_dados_usuario_logado,
            [`usuario_${getUsuarioLogin()}`]: {
                ...dados_usuario_logado,
                visao_selecionada: {
                    nome: converteNomeVisao(visao)
                },
                unidade_selecionada: {
                    uuid: uuid_unidade,
                    tipo_unidade:unidade_tipo,
                    nome:unidade_nome,
                    notificar_devolucao_referencia:null,
                    notificar_devolucao_pc_uuid:null,
                    notificacao_uuid: null,
                },

                associacao_selecionada: {
                    uuid: unidade_tipo === "DRE" ? uuid_unidade: uuid_associacao,
                    nome: unidade_tipo === "DRE" ? unidade_nome: nome_associacao,
                },
            }
        };
        localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(novos_dados_usuario_logado));
    }
};


const redirectVisao = (visao = null) => {
    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();
    if (visao === 'SME') {
        redirect('/acompanhamento-pcs-sme')
    } else if (visao === 'DRE') {
        redirect('/dre-dashboard')
    } else if (visao === 'UE') {
        redirect('/dados-da-associacao')
    } else {
        if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'SME')) {
            redirect('/acompanhamento-pcs-sme')
        } else if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'DRE')) {
            redirect('/dre-dashboard')
        } else if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'UE')) {
            redirect('/dados-da-associacao')
        } else {
            redirect('/dados-da-associacao')
        }
    }
};

const getItemUsuarioLogado = (indice) =>{
    let usuario_logado = getDadosDoUsuarioLogado();
    // eslint-disable-next-line no-eval
    return eval('usuario_logado.' + indice)
};


export const visoesService = {
    forcarNovoLogin,
    setDadosUsuariosLogados,
    getPermissoes,
    setDadosPrimeiroAcesso,
    converteNomeVisao,
    alternaVisoes,
    getDadosDoUsuarioLogado,
    setDadosDoUsuarioLogado,
    redirectVisao,
    getItemUsuarioLogado,
    getUsuarioLogin,
};
