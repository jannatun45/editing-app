export type Stadium = {
  _id: string;
  name_stadium: string;
  city: string;
  capacity: number;
  district?: string;
  image?: string | null;
  address?: string | null;
  opened_year?: number | null;
  surface: "grass" | "artificial" | "hybrid";
};

// export interface Stadium {
//   _id: string;
//   name_stadium: string;
//   city?: string;
//   district?: string;
// }
