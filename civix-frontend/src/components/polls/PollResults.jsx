import React from 'react';
import { Card, CardHeader, CardBody } from '../common/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';

const COLORS = ['#3182ce', '#38a169', '#d69e2e', '#e53e3e', '#805ad5', '#d53f8c', '#319795'];

const PollResults = ({ options, totalVotes }) => {
  const data = options.map(opt => ({
    name: opt.text,
    value: opt.votes,
    percentage: totalVotes > 0 ? ((opt.votes / totalVotes) * 100).toFixed(1) : 0
  })).sort((a, b) => b.value - a.value);

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', padding: '15px 20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#2d3748', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Live Results
          <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#4a5568', padding: '4px 10px', backgroundColor: '#e2e8f0', borderRadius: '6px' }}>
            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          </span>
        </h3>
      </CardHeader>
      
      <CardBody style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        {totalVotes === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a0aec0', padding: '40px 0' }}>
            No votes have been cast yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', height: '100%' }}>
            
            {/* Visual Chart */}
            <div style={{ height: '300px', width: '100%', minHeight: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                {data.length <= 4 ? (
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value, name, props) => [`${value} votes (${props.payload.percentage}%)`, name]}
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                ) : (
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 13, fill: '#4a5568' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{ fill: '#f8fafc' }} 
                        formatter={(value, name, props) => [`${value} votes (${props.payload.percentage}%)`, 'Votes']} 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Detailed textual breakdown */}
            <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {data.map((item, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: '500', color: '#2d3748', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '15px' }} title={item.name}>
                      {item.name}
                    </span>
                    <span style={{ color: '#4a5568', fontWeight: '600', whiteSpace: 'nowrap' }}>
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', backgroundColor: '#edf2f7', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        borderRadius: '9999px', 
                        transition: 'width 1s ease-out',
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PollResults;
