import {ElMessageBox,ElDialog,ElSwitch, ElPagination,ElTable,ElTableColumn, ElButton ,ElForm,ElFormItem,ElInput,ElMessage,ElContainer,ElHeader,ElAside,ElMain,ElMenu,ElSubmenu,ElMenuItem,ElCard,ElBreadcrumb,ElBreadcrumbItem,ElRow,ElCol } from 'element-plus'

export default (app:any) => {
  app.use(ElButton),
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElAside)
  app.use(ElMain)
  app.use(ElMenu)
  app.use(ElSubmenu)
  app.use(ElMenuItem)
  app.use(ElCard)
  app.use(ElBreadcrumb)  
  app.use(ElBreadcrumbItem)  
  app.use(ElRow)  
  app.use(ElCol)  
  app.use(ElTable)  
  app.use(ElTableColumn)  
  app.use(ElPagination)  
  app.use(ElSwitch)  
  app.use(ElDialog)  
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$confirm = ElMessageBox.confirm
}