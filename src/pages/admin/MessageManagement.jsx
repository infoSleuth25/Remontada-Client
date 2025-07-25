import { Cancel as CancelIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import RenderAttachment from '../../components/shared/RenderAttachment';
import Table from '../../components/shared/Table';
import { fileFormat, transformImage } from '../../lib/features';
import { useAdminAllMessagesQuery } from '../../redux/api/api';

const columns = [
  {
  field : "id",
  headerName : "ID",
  headerClassName : "table-header",
  width : 200
  },
  {
  field : "attachments",
  headerName : "Attachments",
  headerClassName : "table-header",
  width : 200,
  renderCell : (params)=>{
    const {attachments} = params.row;
    return attachments?.length > 0 ?
    attachments.map((i)=>{
      const url = i.url;
      const file = fileFormat(url);
      return <Box key={i.public_id}>
        <a href={url} download target='_blank' style={{color:"black"}}>
          {RenderAttachment(file,url)}
        </a>
      </Box>
    })
    : "No Attachements"
  }
  },
  {
  field : "content",
  headerName : "Content",
  headerClassName : "table-header",
  width : 400,
  renderCell : (params) =>{
    const {content} = params.row;
    return content ? content : "No Content"
  }
  },
  {
  field : "sender",
  headerName : "Sent By",
  headerClassName : "table-header",
  width : 200,
  renderCell : (params)=>(
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
      <span>{params.row.sender.name}</span>
    </Stack>
  )
  },
  {
  field : "chat",
  headerName : "Chat",
  headerClassName : "table-header",
  width : 220,
  },
  {
  field : "groupChat",
  headerName : "Group Chat",
  headerClassName : "table-header",
  width : 100,
  renderCell: (params) =>
    params.row.groupChat ? (
      <CheckCircleIcon color="success" />
    ) : (
      <CancelIcon color="error" />
    )  },
  {
  field : "createdAt",
  headerName : "Time",
  headerClassName : "table-header",
  width : 250,
  },
];

const MessageManagement = () => {
  const {data,isLoading} = useAdminAllMessagesQuery();
  const [rows,setRows] = useState([])
  useEffect(()=>{
    if(data){
      setRows(data.messages.map((i)=>({
        ...i,
        id : i._id,
        sender : {
          name : i.sender.name,
          avatar : transformImage(i.sender.avatar,50)
        },
        createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a")
      })))
    }
  },[data])
  return (
    <AdminLayout>
      {
        isLoading ? <Skeleton /> : <Table heading={"All Messages"} columns={columns} rows={rows}  rowHeight={200} />
      }     
    </AdminLayout>
  )
}


export default MessageManagement