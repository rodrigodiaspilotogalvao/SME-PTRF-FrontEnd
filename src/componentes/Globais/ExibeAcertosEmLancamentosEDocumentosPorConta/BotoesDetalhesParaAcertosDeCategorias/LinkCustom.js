import React, {memo} from "react";
import {Link} from "react-router-dom";
import {visoesService} from "../../../../services/visoes.service";
import {RetornaSeTemPermissaoEdicaoAjustesLancamentos} from "../RetornaSeTemPermissaoEdicaoAjustesLancamentos";

const LinkCustom = ({url, analise_lancamento, prestacaoDeContasUuid, prestacaoDeContas, classeCssBotao, children}) => {

    const getCurrentPathWithoutLastPart = () => {
        const pathRgx = /\//g;
        const childroutecount = ((window.location.pathname || '').match(pathRgx) || []).length
        return childroutecount > 1 ? window.location.pathname.slice(0, window.location.pathname.lastIndexOf('/')) : window.location.pathname;
    }

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAjustesLancamentos(prestacaoDeContas)

    return(
        <Link
            to={{
                pathname: `${url}`,
                state: {
                    uuid_analise_lancamento: analise_lancamento.uuid,
                    uuid_pc: prestacaoDeContasUuid,
                    uuid_despesa: analise_lancamento.despesa,
                    origem: getCurrentPathWithoutLastPart(),
                    origem_visao: visoesService.getItemUsuarioLogado('visao_selecionada.nome'),
                    tem_permissao_de_edicao: TEMPERMISSAO
                }
            }}
            className={classeCssBotao}
        >
            {children}
        </Link>
    )
}

export default memo(LinkCustom)