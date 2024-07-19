// import React from "react";
// import { Card, CardContent, Typography } from "@mui/material";

// const formatter = new Intl.NumberFormat("en-US", {
//   style: "currency",
//   currency: "NGN",
//   minimumFractionDigits: 2,
// });

// const CardsComponent = ({ transactions, users, properties }) => {
//   const stats = [
//     { label: "Users", value: users?.length },
//     {
//       label: "Agents",
//       value: users?.filter((user) => user.role === "Agent").length,
//     },
//     {
//       label: "Total Income",
//       value: `${formatter.format(
//         Number(transactions?.reduce((sum, t) => sum + t.amount, 0))
//       )}`,
//     },

//     {
//       label: "Properties Under Payment",
//       value: users?.reduce(
//         (sum, user) => sum + user.propertyUnderPayment.length,
//         0
//       ),
//     },
//     {
//       label: "Properties Sold/Rented",
//       value: users?.reduce(
//         (sum, user) => sum + user.propertyPurOrRented.length,
//         0
//       ),
//     },
//     {
//       label: "Total Properties Sold",
//       value: users?.reduce(
//         (sum, user) =>
//           sum +
//           user.propertyPurOrRented?.reduce(
//             (acc, curr) => acc + (curr.paymentPurpose === "For Sale" ? 1 : 0),
//             0
//           ),
//         0
//       ),
//     },
//     {
//       label: "Total Properties Rented",
//       value: users?.reduce(
//         (sum, user) =>
//           sum +
//           user.propertyPurOrRented?.reduce(
//             (acc, curr) =>
//               acc + (curr.paymentPurpose === "For Renting" ? 1 : 0),
//             0
//           ),
//         0
//       ),
//     },
//     { label: "Total Properties Listed", value: properties?.length },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//       {stats.map((stat, index) => (
//         <Card key={index} className="shadow-lg">
//           <CardContent>
//             <Typography variant="h5" component="div">
//               {stat.label}
//             </Typography>
//             <Typography variant="h6" component="div">
//               {stat.value}
//             </Typography>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default CardsComponent;
import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Home as HomeIcon,
  ListAlt as ListAltIcon,
  MonetizationOn as MonetizationOnIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

const CardsComponent = ({ transactions, users, properties }) => {
  const stats = [
    { label: "Users", value: users?.length, icon: <PeopleIcon /> },
    {
      label: "Agents",
      value: users?.filter((user) => user.role === "Agent").length,
      icon: <PeopleIcon />,
    },
    {
      label: "Total Income",
      value: `${formatter.format(
        Number(transactions?.reduce((sum, t) => sum + t.amount, 0))
      )}`,
      icon: <AttachMoneyIcon />,
    },
    {
      label: "Properties Under Payment",
      value: users?.reduce(
        (sum, user) => sum + user.propertyUnderPayment.length,
        0
      ),
      icon: <HomeIcon />,
    },
    {
      label: "Properties Sold/Rented",
      value: users?.reduce(
        (sum, user) => sum + user.propertyPurOrRented.length,
        0
      ),
      icon: <HomeIcon />,
    },
    {
      label: "Total Properties Sold",
      value: users?.reduce(
        (sum, user) =>
          sum +
          user.propertyPurOrRented?.reduce(
            (acc, curr) => acc + (curr.paymentPurpose === "For Sale" ? 1 : 0),
            0
          ),
        0
      ),
      icon: <MonetizationOnIcon />,
    },
    {
      label: "Total Properties Rented",
      value: users?.reduce(
        (sum, user) =>
          sum +
          user.propertyPurOrRented?.reduce(
            (acc, curr) =>
              acc + (curr.paymentPurpose === "For Renting" ? 1 : 0),
            0
          ),
        0
      ),
      icon: <AssignmentTurnedInIcon />,
    },
    {
      label: "Total Properties Listed",
      value: properties?.length,
      icon: <ListAltIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg">
          <CardContent>
            <Box
              display="flex flex-col"
              alignItems="center"
              justifyContent="center"
            >
              <Box marginRight={2}>
                <Typography variant="h5" color="primary">
                  {stat.icon}
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" component="div">
                  {" "}
                  {stat.label}{" "}
                </Typography>
                {stat.label === "Total Income" ? (
                  <Typography
                    component="div"
                    className="formatted-number text-wrap"
                  >
                    {" "}
                    {stat.value}{" "}
                  </Typography>
                ) : (
                  <Typography variant="h6" component="div">
                    {" "}
                    {stat.value}{" "}
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CardsComponent;
