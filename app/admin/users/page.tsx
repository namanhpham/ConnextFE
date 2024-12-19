'use client'
import { getUserPaginated } from '@/app/api/admin/adminApiService';
import { Table, Card, Select, TablePaginationConfig } from 'antd';
import { useState, useEffect } from 'react';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const filterOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'online', label: 'Online Users' },
    { value: 'offline', label: 'Offline Users' }
  ];

  const columns = [
    {
      title: 'User ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Nickname',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (nickname: string | null) => nickname ? nickname : 'None',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'DoB',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      render: (date_of_birth: string | null) => date_of_birth ? date_of_birth : 'None',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'isOnline',
      key: 'isOnline',
      render: (isOnline: boolean) => isOnline ? 'Online' : 'Offline',
    },
  ];

  const fetchUsers = async (page = 1, status = filter) => {
    const data = await getUserPaginated(pagination.pageSize, page, status !== 'all' ? status : undefined);
    setUsers(data.data);
    setPagination({
      ...pagination,
      total: data.pagination.totalUsers,
      current: page,
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchUsers(newPagination.current);
  };
  return (
    <Card>
      <div style={{
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={handleFilterChange}
          options={filterOptions}
        />
      </div>
      <Table
        columns={columns}
        dataSource={users}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default UserManagementPage;
