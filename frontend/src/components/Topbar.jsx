export default function DashboardTopbar({
  title = "Dashboard",
  SearchIcon,
  BellIcon,
  UserIcon,
  searchPlaceholder = "Поиск...",
}) {
  return (
    <div className="topbar">
      <h1 className="title">{title}</h1>

      <div className="topRight">
        <div className="search">
          <span className="searchIcon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input placeholder={searchPlaceholder} />
        </div>

        <button className="iconBtn" type="button" aria-label="notifications">
          <BellIcon />
        </button>

        <button className="iconBtn" type="button" aria-label="user">
          <UserIcon />
        </button>
      </div>
    </div>
  );
}