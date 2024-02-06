import { FormikHelpers } from 'formik'
import { TFields } from '@/features/trade/containers/create-order/FormLimit/types'

type TFormik = FormikHelpers<TFields>

class FormikClass {
  formik?: TFormik

  constructor() {
    this.formik = undefined
  }

  set(formik: TFormik): void {
    this.formik = formik
  }

  get() {
    return this.formik
  }

  remove() {
    this.formik = undefined
  }
}

export const FormikOrder = new FormikClass()
