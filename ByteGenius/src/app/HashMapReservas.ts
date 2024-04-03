

export interface HashMapReservas {
    [idUsuario: number]: {
        [idDia: number]: {
            [idHora: number]: {
                idEntrenador: number;
            }
        }
    };
}

