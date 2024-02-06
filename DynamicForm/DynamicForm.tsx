import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import { useFormik } from 'formik'
import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { TFormSubmit } from '@/types/formik'
import { FormikTextField } from '@/components/inputs/FormikTextField'
import { useChangeForm } from '@/hooks/use-change-form'
import { EInputType, TFormValues, TPageForm } from '@/types/dynamic-form'
import { FormikSelect } from '../inputs/FormikSelect'
import { DynamicSelect } from '../inputs/DynamicSelect/DynamicSelect'
import { FormikCheckbox } from '../inputs/FormikCheckbox'

export type TProps = {
  config: TPageForm
  initial?: TFormValues
  onAccept: TFormSubmit<TFormValues>
  variant?: 'modal'
}

export const DynamicForm: React.FC<TProps> = ({ onAccept, config, initial, variant }) => {
  const { form, title, descriptopn, editable = true, submitLabel = 'Save' } = config

  const createInitial = () => {
    const result: TFormValues = {}

    config.form.forEach((input) => {
      if (input.type === EInputType.delimiter) return
      result[input.name] = ''
    })
    return result
  }

  const initialVal = initial || createInitial()

  const { isEqual } = useChangeForm(initialVal)

  const formik = useFormik<TFormValues>({
    enableReinitialize: true,
    initialValues: initialVal,
    onSubmit: (formData, formik) => {
      if (editable && isEqual(formData)) {
        formik.setSubmitting(false)
        return
      }
      onAccept({
        formData: { ...formData },
        formik
      })
    }
  })

  return (
    <Grid container>
      <Grid item xs={12}>
        {title && (
          <Typography
            variant={variant === 'modal' ? 'h5' : 'h3'}
            textAlign="center"
            mb={4}
          >
            {title}
          </Typography>
        )}

        <Typography variant="h6" textAlign="center" mb={4}>
          {descriptopn}
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Paper
            component={Box}
            p={variant !== 'modal' ? 5 : undefined}
            maxWidth={750}
            sx={{
              margin: variant !== 'modal' ? '1rem auto' : undefined,
              paddingTop: variant !== 'modal' ? '3rem' : undefined,
              pointerEvents: formik.isSubmitting ? 'none' : 'auto',
              boxShadow: variant === 'modal' ? 'none' : undefined
            }}
          >
            <Grid container flexDirection="column" spacing={2}>
              {form.map((input) => {
                if (
                  input.type === EInputType.string ||
                  input.type === EInputType.number ||
                  input.type === EInputType.numberString
                ) {
                  const { editable: inputEditable = true } = input

                  return (
                    <Grid item xs key={input.name}>
                      <FormikTextField
                        type={input.type === EInputType.string ? 'string' : 'number'}
                        label={input.label || input.name}
                        placeholder={input.placeholder || input.name}
                        name={input.name}
                        fullWidth
                        formik={formik}
                        disabled={!editable || !inputEditable}
                      />
                    </Grid>
                  )
                }

                if (input.type === EInputType.select) {
                  const { editable: inputEditable = true } = input
                  return (
                    <Grid item xs key={input.name}>
                      <DynamicSelect
                        list={input.list}
                        select={(list) => (
                          <FormikSelect
                            list={list}
                            label={input.label || input.name}
                            placeholder={input.placeholder || input.name}
                            name={input.name}
                            formik={formik}
                            disabled={!editable || !inputEditable}
                            nameExtractor={({ value }) => value}
                            valueExtractor={({ name }) => name}
                          />
                        )}
                      />
                    </Grid>
                  )
                }

                if (input.type === EInputType.checkbox) {
                  const { editable: inputEditable = true } = input

                  return (
                    <Grid item xs key={input.name}>
                      <FormikCheckbox
                        name={input.name}
                        formik={formik}
                        label={input.label || input.name}
                        disabled={!editable || !inputEditable}
                      />
                    </Grid>
                  )
                }

                if (input.type === EInputType.delimiter) {
                  return (
                    <Grid item xs key={input.title}>
                      <Typography variant="h6" textAlign="left">
                        {input.title.toUpperCase()}
                      </Typography>
                    </Grid>
                  )
                }

                return <></>
              })}
              <Grid item xs>
                <LoadingButton
                  variant="contained"
                  loading={formik.isSubmitting}
                  type="submit"
                  fullWidth
                  disabled={!editable}
                >
                  {submitLabel}
                </LoadingButton>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </Grid>
    </Grid>
  )
}
