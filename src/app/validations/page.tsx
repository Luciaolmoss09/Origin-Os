import { getPendingValidations } from "@/lib/actions/validations"
import ValidationsClient from "./ValidationsClient"

export default async function ValidationsPage() {
  const res = await getPendingValidations()
  const valData = res.success ? res.data : []

  return <ValidationsClient initialValidations={valData as any} />
}
