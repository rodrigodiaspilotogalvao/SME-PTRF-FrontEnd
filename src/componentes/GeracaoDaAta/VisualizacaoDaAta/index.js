import React, {useState} from "react";
import "../geracao-da-ata.scss"
import {TopoComBotoes} from "./TopoComBotoes";
import {TextoDinamicoSuperior} from "./TextoDinamicoSuperior";
import {TabelaDinamica} from "./TabelaDinamica";
import {TabelaTotais} from "./TabelaTotais";
import {TextoDinamicoInferior} from "./TextoDinamicoInferior";
import {EditarAta} from "../../../utils/Modais";

export const VisualizacaoDaAta = () => {
    const [showEditarAta, setShowEditarAta] = useState(false);
    const [stateFormEditarAta, setStateFormEditarAta] = useState({
        comentarios_ata:"Valor inicial comentário ata",
        posicionamento:"3",
        tipo_reuniao:"",
        local_reuniao:"",
        presidente_reuniao:"",
        secretario_reuniao:"",
        data_reuniao:"",
        abertura_reuniao:"",
        cargo_presidente_reuniao:"",
        cargo_secretario_reuniao:"",
    });

    const onHandleClose = () => {
        setShowEditarAta(false);
    }

    const handleClickEditarAta = () => {
        setShowEditarAta(true);
    }

    const handleChangeEditarAta = (name, value) => {
        setStateFormEditarAta({
            ...stateFormEditarAta,
            [name]: value
        });
    }

    const handleClickFecharAta = () => {
        window.location.assign("/prestacao-de-contas")
    }

    const handleClickCopiarAta = ()=> {

        let  doc = document, text = doc.getElementById("copiar")
        let range, selection;

        if(doc.body.createTextRange){
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        }
        else if(window.getSelection){
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        document.execCommand('copy')
    };

    const onSubmitEditarAta = () =>{
        console.log("onSubmitEditarAta ", stateFormEditarAta)
    }

    return(
        <div className="col-12 container-visualizacao-da-ata mb-5">
            <div className="col-12 mt-4">
                <TopoComBotoes
                    handleClickEditarAta={handleClickEditarAta}
                    handleClickFecharAta={handleClickFecharAta}
                    handleClickCopiarAta={handleClickCopiarAta}
                />
            </div>

            <div id="copiar" className="col-12">
                <TextoDinamicoSuperior/>
                <TabelaDinamica/>
                <TabelaTotais/>
                <TextoDinamicoInferior/>
            </div>

            <section>
                <EditarAta
                    show={showEditarAta}
                    handleClose={onHandleClose}
                    onSubmitEditarAta={onSubmitEditarAta}
                    onChange={handleChangeEditarAta}
                    stateFormEditarAta={stateFormEditarAta}
                />
            </section>
        </div>
    )
}