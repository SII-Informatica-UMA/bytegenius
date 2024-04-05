export interface HashMap {
  [idDia: number]: { 
      [idHora: number]: { 
          idTrainers: number[];
      }; 
  };
}