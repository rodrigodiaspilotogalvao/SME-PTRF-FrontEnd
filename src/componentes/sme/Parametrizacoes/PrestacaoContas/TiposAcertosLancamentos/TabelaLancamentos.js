import React, {useEffect, useState}from "react";
import {getTabelaCategoria} from "../../../../../services/sme/Parametrizacoes.service";
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column'


export const TabelaLancamentos = ({todosLancamentos, rowsPerPage, lancamentosTemplate}) => {
    const [categoriaTabela, setCategoriaTabela] = useState([]);

    const ativoTemplate = (rowData) => {
        return rowData.ativo ? "Sim" : "Não";
    }

    useEffect(() => {
        async function carregaTabelaCategoria() {
            let resp = await getTabelaCategoria()
            setCategoriaTabela(resp.categorias)
        }
        carregaTabelaCategoria();
    }, []);

    const categoriaTemplate = (rowData) => {
        if (categoriaTabela.length > 0){
            let categoria = categoriaTabela.find(categoria => categoria.id === rowData.categoria)
            return categoria.nome
        }
    }


    return(
        <DataTable
            value={todosLancamentos}
            paginator={todosLancamentos.length > rowsPerPage}
            paginatorTemplate="PrevPageLink PageLinks NextPageLink"
            rows={rowsPerPage}
        >
            <Column field="nome" header="Nome do tipo"/>
            <Column 
                field="categoria"
                header="Categoria de acerto em lançamento"
                body={categoriaTemplate}
            />
            <Column field="ativo" header="Ativo" body={ativoTemplate}/>
            <Column
                field="acoes"
                header="Ações"
                body={lancamentosTemplate}
            />
        </DataTable>
    )
};