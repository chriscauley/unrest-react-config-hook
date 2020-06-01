import React from 'react'
import globalHook from 'use-global-hook'
import Storage from '@unrest/storage'
import Form from '@unrest/react-jsonschema-form'

class ConfigForm extends React.Component {
  state = {}
  onSubmit = (formData) => this.props.config.actions.save({ formData })
  onChange = (formData) => this.setState({ formData })
  render() {
    const { config, ...props } = this.props
    const { schema, uiSchema, formData } = config
    return (
      <Form
        formData={this.state.formData || formData}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={this.onSubmit}
        onChange={this.onChange}
        {...props}
      />
    )
  }
}

export default (name, { initial, schema, uiSchema, actions, propName='config' }) => {
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

  const connect = (Component, { propName = og_propName } = {}) => {
    return function ConfigProvider(props) {
      const [state, actions] = makeHook()
      const connectedProps = {
        ...props,
        [propName]: {
          schema,
          uiSchema,
          ...state,
          Form: connect.Form,
          actions,
        },
      }
      return <Component {...connectedProps} />
    }
  }

  connect.Form = connect(ConfigForm)

  return connect
}
