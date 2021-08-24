export default interface FilterType {
  id: string,
  checked: boolean,
  label: string,
  validator: (t: any) => boolean,
}