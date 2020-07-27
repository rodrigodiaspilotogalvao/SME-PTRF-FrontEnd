import React, {useState} from "react";
import "./tags.scss"

export const Tags = ({formikProps, index, rateio, verboHttp, disabled, despesasTabelas}) => {

    const [escolhaTags, setEscolhaTags] = useState({})

    const toggleIcon = (id, valor) => {
        console.log("toggleIcon ", valor)
        setEscolhaTags({
            ...escolhaTags,
            [id]: valor
        });
    };

    console.log("escolhaTags ", escolhaTags)
    return (
        <div className="container-tags mt-4">
            <div className="form-row align-items-center box-escolha-tag">
                <div className="col-auto">
                    <p className='mb-0 mr-4 font-weight-normal'>Esse gasto possui vínculo a alguma etiqueta?</p>
                </div>
                <div className="col-auto">
                    <div className="form-check form-check-inline">
                        <input
                            name={`escolhaTags${index}`}
                            onChange={(e) => {
                                formikProps.handleChange(e);
                                toggleIcon(index, 'sim')
                            }}

                            className={`${!rateio.tag && verboHttp === "PUT" && "is_invalid "} form-check-input`}
                            type="radio"
                            id={`tag_sim_${index}`}
                            value="sim"
                            disabled={disabled}
                            //checked={escolhaTags[index] === 'sim' || rateio.tag !== null}
                        />
                        <label className="form-check-label" htmlFor={`tag_sim_${index}`}>Sim</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input
                            name={`escolhaTags${index}`}
                            onChange={(e) => {
                                formikProps.handleChange(e);
                                toggleIcon(index, 'nao')
                            }}
                            className={`${!rateio.tag && verboHttp === "PUT" && "is_invalid "} form-check-input`}
                            type="radio"
                            id={`tag_nao_${index}`}
                            value="nao"
                            disabled={disabled}
                            //checked={escolhaTags[index] === 'nao' || rateio.tag === null}
                        />
                        <label className="form-check-label" htmlFor={`tag_nao_${index}`}>Não</label>
                    </div>
                </div>
                {escolhaTags[index] === 'sim' &&
                <div className="col-auto">
                    {console.log("XXXXXXXXXXXXXXXXXXXXXX ", rateio.tag)}
                    <select

                        value={
                            rateio.tag !== null ? (
                                typeof rateio.tag === "object" ? rateio.tag.uuid : rateio.tag
                            ) : ""
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].tag`}
                        id='tag'
                        className={`${!rateio.tag && verboHttp === "PUT" && "is_invalid "} form-control`}
                        disabled={disabled}
                    >
                        <option key={0} value="">Selecione uma ação</option>
                        {despesasTabelas.tags && despesasTabelas.tags.map(item => (
                            <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                        ))}
                    </select>
                </div>
                }
            </div>
        </div>
    )
};