import React from 'react'
import globalHook from 'use-global-hook'
import Storage from '@unrest/storage'
import Form from '@unrest/react-jsonschema-form'

export default (name, options = {}) => {
  const { initial, schema, uiSchema, actions, propName = 'config' } = options
  const og_propName = propName
  const storage = new Storage('app_config__' + name)
  const base_actions = {
    save: (store, data) => {
      Object.keys(data).forEach((key) => storage.set(key, data[key]))
      store.setState(data)
      store.actions.onSave(data)
    },
    onSave() {},
  }
  const initialState = { ...initial }
  storage.keys.forEach((key) => {
    initialState[key] = storage.get(key)
  })
  const makeHook = globalHook(React, initialState, {
    ...base_actions,
    ...actions,
  })

  const useConfig = () => {
    const [state, actions] = makeHook()
    return {
      schema,
      uiSchema,
      ...state,
      actions,
    }
  }

  const connect = (Component, { propName = og_propName } = {}) => {
    return function ConfigProvider(props) {
      return <Component {...props} {...{ [propName]: useConfig() }} />
    }
  }

  function ConfigForm(props) {
    const { schema, uiSchema, formData, actions } = useConfig()
    const [state, setState] = React.useState(formData)
    const onSubmit = (formData) => {
      actions.save({ formData })
      props.onSubmit && props.onSubmit({ formData })
    }
    const onChange = (formData) => {
      props.onChange && props.onChange(formData)
      setState(formData)
    }
    return (
      <Form
        {...props}
        formData={state}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        onChange={onChange}
      />
    )
  }
  connect.useConfig = useConfig
  connect.Form = ConfigForm
  return connect
}
