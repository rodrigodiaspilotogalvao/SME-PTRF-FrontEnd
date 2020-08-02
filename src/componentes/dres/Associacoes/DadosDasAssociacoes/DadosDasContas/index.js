import React from "react";
import {Redirect} from "react-router-dom";
import {TopoComBotoes} from "../TopoComBotoes";
import {MenuInterno} from "../../../../Globais/MenuInterno";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {InfosContas} from "./InfosContas";

export const DadosDasContas = () =>{
    let dadosDaAssociacao = JSON.parse(localStorage.getItem("DADOS_DA_ASSOCIACAO"));

    return (
        <>
            <h1>Estou em dados das contas</h1>
            {dadosDaAssociacao ? (
                    <>
                        <TopoComBotoes
                            dadosDaAssociacao={dadosDaAssociacao}
                        />
                        <div className="page-content-inner">
                            <MenuInterno
                                caminhos_menu_interno = {UrlsMenuInterno}
                            />
                            <InfosContas
                                dadosDaAssociacao={dadosDaAssociacao}
                            />
                        </div>
                    </>
                ) :
                <Redirect
                    to={{
                        pathname: "/dre-associacoes",
                    }}
                />
            }
        </>
    );
};