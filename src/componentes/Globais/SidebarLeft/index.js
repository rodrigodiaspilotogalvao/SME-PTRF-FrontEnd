import React, {useContext} from 'react'
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import './siderbarLeft.scss'
import LogoSP from '../../../assets/img/logo-menu-tratado.png'
import {SidebarContext} from '../../../context/Sidebar'
import {useHistory} from 'react-router-dom'
import {Versao} from "../Versao";
import ReactTooltip from "react-tooltip";
import {getUrls} from "./getUrls";
import {NotificacaoContext} from "../../../context/Notificacoes";
import {visoesService} from "../../../services/visoes.service";
import {Ambientes} from "../Ambientes";
import {AmbientesApi} from "../AmbientesApi";

import { useLocation } from 'react-router-dom'

export const SidebarLeft = () => {
    const sidebarStatus = useContext(SidebarContext);
    const notificacaoContext = useContext(NotificacaoContext);
    let history = useHistory();

    const location = useLocation();

    //console.log("XXXXXXXXXXXXXXXX HISTORY ", history)
    //console.log("XXXXXXXXXXXXXXXX location ", location)

    const onToggle = () => {
        sidebarStatus.setSideBarStatus(!sidebarStatus.sideBarStatus)
    };

    let urls = getUrls.GetUrls();

    const getPathname = () => {
        let path_name = location.pathname.replace(/\//gi, '')
        console.log("XXXXXXXXXXXXX getPathname ", path_name)
        return path_name
    }

    const qtdeNotificacoesNaoLidas = async () => {
        await notificacaoContext.getQtdeNotificacoesNaoLidas()
    };

    return (
        <>
            <SideNav
                id="sideBarLeft"
                className="sideNavCustomizado"
                expanded={sidebarStatus.sideBarStatus}
                onSelect={(selected) => {
                    console.log("SELECTED ", selected)
                    qtdeNotificacoesNaoLidas();
                    visoesService.forcarNovoLogin();
                    const to = '/' + selected;
                    console.log("xxxxxxxxxxxX ", history.location.pathname)
                    if (history.location.pathname !== to) {
                        history.push(to)
                    }
                }}
                onToggle={onToggle}
            >
                <SideNav.Toggle/>
                {/*<SideNav.Nav defaultSelected={urls.dados_iniciais.default_selected}>*/}
                <SideNav.Nav defaultSelected={getPathname()}>
                    {urls && urls.lista_de_urls.length > 0 && urls.lista_de_urls.map((url, index) => {
                            return (
                                visoesService.getPermissoes(url.permissoes) ? (
                                    <NavItem
                                        key={index}
                                        navitemClassName={`d-flex align-items-end ${url.subItens && url.subItens.length > 0 ? "sub-menu" : ""}`}
                                        data-tip={url.label} data-for={url.dataFor}
                                        eventKey={url.url}
                                    >
                                        <NavIcon>
                                            <img src={url.icone} alt=""/>
                                        </NavIcon>
                                        <NavText>{url.label}</NavText>
                                        <ReactTooltip disable={sidebarStatus.sideBarStatus}
                                                      id={url.dataFor}>{}</ReactTooltip>
                                        {url.subItens && url.subItens.length > 0 && url.subItens.map((subItem, index) =>
                                            visoesService.getPermissoes(subItem.permissoes) ? (
                                            <NavItem
                                                key={index}
                                                navitemClassName="sub-menu-item"
                                                eventKey={subItem.url}
                                            >
                                                <NavText>
                                                    {subItem.label}
                                                </NavText>
                                            </NavItem>): null
                                        )}
                                    </NavItem>
                                ) : null
                            )
                        }
                    )
                    }
                    <NavItem
                        eventKey={urls.dados_iniciais.default_selected}
                        navitemClassName={
                            !sidebarStatus.sideBarStatus
                                ? 'escondeItem'
                                : 'navItemCustomizadoNome'
                        }
                    >
                        <NavIcon>&nbsp;</NavIcon>
                        <NavText>
                            <div className="container-nome-instituicao mt-n4">
                                <img src={LogoSP} alt=""/>
                            </div>
                        </NavText>
                    </NavItem>
                    <NavItem
                        navitemClassName={!sidebarStatus.sideBarStatus ? 'escondeItem' : 'navItemCustomizadoNome'}
                        eventKey={urls.dados_iniciais.default_selected}
                    >
                        <NavText>
                            <Versao/>
                        </NavText>
                    </NavItem>
                    <NavItem
                        navitemClassName={!sidebarStatus.sideBarStatus ? 'escondeItem' : 'navItemCustomizadoNome'}
                        eventKey={urls.dados_iniciais.default_selected}
                    >
                        <NavText>
                            <Ambientes/>
                        </NavText>
                    </NavItem>
                    <NavItem
                        navitemClassName={!sidebarStatus.sideBarStatus ? 'escondeItem' : 'navItemCustomizadoNome'}
                        eventKey={urls.dados_iniciais.default_selected}
                    >
                        <NavText>
                            <AmbientesApi/>
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
        </>
    )
};
