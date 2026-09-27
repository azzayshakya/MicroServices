import ModeTable from './ModeTable'

export default function CrudTable({
  tableData,
  columns,
  paramObj,
  setParamObj,
  setRefreshCounter,
  loading,
  scroll,
  ...restProps
}) {
  const handleTableChange = (pagination) => {
    setParamObj((prev) => ({
      ...prev,
      limit: pagination.pageSize,
      offset: pagination.current - 1,
      total: pagination.total,
    }))

    setRefreshCounter((c) => c + 1)
  }

  return (
    <ModeTable
      className="hacker-table"
      size="small"
      dataSource={tableData}
      columns={columns}
      rowKey={(record) => record?._id || record?.id || record?.aon}
      pagination={{
        current: (paramObj.offset || 0) + 1,
        pageSize: paramObj.limit || 10,
        total: paramObj.total || tableData?.length || 0,
        showSizeChanger: true,
      }}
      loading={loading}
      onChange={handleTableChange}
      scroll={scroll || { x: 800 }}
      {...restProps}
    />
  )
}
