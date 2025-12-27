$ports = 8080..8088
$pids = @()
foreach($p in $ports){
  $c = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue
  if ($c) { $pids += $c.OwningProcess }
}
$pids = $pids | Where-Object { $_ -and $_ -ne 0 } | Sort-Object -Unique
if ($pids) {
  foreach($killPid in $pids){
    Write-Output "Killing PID $killPid"
    taskkill /PID $killPid /F
  }
} else {
  Write-Output "No matching PIDs found"
}
