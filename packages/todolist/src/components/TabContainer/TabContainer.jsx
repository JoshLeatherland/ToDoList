import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ width: "100%", height: "100%" }}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            width: "100%",
            height: "100%",
            overflowY: "scroll",
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function TabContainer({
  tabs = [],
  textColor = "primary",
  centered = false,
  variant = "scrollable",
  orientation = "horizontal",
  ...props
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isVertical = orientation === "vertical";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isVertical ? "row" : "column",
        height: "100%",
        width: "90%",
        flexGrow: 1,
      }}
      {...props}
    >
      <Tabs
        orientation={orientation}
        variant={variant}
        value={value}
        onChange={handleChange}
        aria-label={`${orientation} tabs`}
        textColor={textColor}
        centered={centered && !isVertical}
        sx={
          isVertical
            ? { borderRight: 1, borderColor: "divider" }
            : { borderBottom: 1, borderColor: "divider" }
        }
      >
        {tabs.map((tab, index) => (
          <Tab
            label={tab.label}
            disabled={tab.disabled}
            icon={tab.icon}
            iconPosition={tab.iconPosition}
            key={index}
            sx={
              isVertical
                ? { alignItems: "flex-end", textAlign: "right", width: "100%" }
                : {}
            }
          />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <TabPanel value={value} index={index} key={index}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
}

export default TabContainer;

TabContainer.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.node,
      disabled: PropTypes.bool,
      icon: PropTypes.node,
      iconPosition: PropTypes.oneOf(["top", "start", "bottom", "end"]),
    })
  ).isRequired,
  textColor: PropTypes.oneOf(["primary", "secondary"]),
  centered: PropTypes.bool,
  variant: PropTypes.oneOf(["standard", "scrollable", "fullWidth"]),
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
};
