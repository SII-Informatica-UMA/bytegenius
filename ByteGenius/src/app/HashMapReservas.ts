
export interface HashMapReservas {
    [idUsuario: number]: {
        [idMes:number]:{
        [idDia: number]: {
            [idHora: number]: {
                idEntrenador: number;
            }
        }
    };
}
}

