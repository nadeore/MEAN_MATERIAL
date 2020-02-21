export class Product {
  id: number;
  uniqueID: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobile: number;
  active: boolean;
  results: Product[];
  // @ts-ignore
  constructor(public id: number, public firstName: string) {}
}
