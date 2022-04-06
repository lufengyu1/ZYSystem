import {ElSelect,ElOption,ElTimeline,ElTimelineItem,ElTag,ElDropdown,ElDropdownItem,ElDropdownMenu,ElInputNumber,ElTabs,ElTabPane,ElBadge,ElMessageBox,ElDialog,ElSwitch, ElPagination,ElTable,ElTableColumn, ElButton ,ElForm,ElFormItem,ElInput,ElMessage,ElContainer,ElHeader,ElAside,ElMain,ElMenu,ElSubmenu,ElMenuItem,ElCard,ElBreadcrumb,ElBreadcrumbItem,ElRow,ElCol } from 'element-plus'

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
  app.use(ElBadge)  
  app.use(ElTabPane)  
  app.use(ElTabs)  
  app.use(ElInputNumber)  
  app.use(ElDropdown)  
  app.use(ElDropdownItem)  
  app.use(ElDropdownMenu)  
  app.use(ElTag)  
  app.use(ElTimeline)  
  app.use(ElTimelineItem)  
  app.use(ElSelect)  
  app.use(ElOption)  
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$confirm = ElMessageBox.confirm
}
