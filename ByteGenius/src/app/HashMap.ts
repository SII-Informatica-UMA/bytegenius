export interface HashMap {
  [idMes: number]: {
    [idDia: number]: {
      [idHora: number]: {
        idTrainers: number[];
      };
    };
  };
}