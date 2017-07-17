<?php
	$subject = "New Email from SOAJS Website";
	
    function buildResponse($msg){
        if($msg != null){
            $response = array(
                "result" => false,
                "error"=> $msg
            );
        }
        else{
            $response = array(
                "result" => true,
                "data"=> true
            );
        }
        echo json_encode($response);
        die();
    }

    function checkGoogleReCaptcha($captcha){

        function getCurlData($url){
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($curl, CURLOPT_TIMEOUT, 10);
            curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16");
            $curlData = curl_exec($curl);
            curl_close($curl);
            return $curlData;
        }

       $secret = "6LcMzgMTAAAAALLjfMQNVBkuuZcZXocZ_2IVfsgY";
       $url = "https://www.google.com/recaptcha/api/siteverify";
       $url.= "?secret=$secret&response=$captcha";
       $res = json_decode(getCurlData($url), true);
       return ($res['success'] == 1) ? true : false;
    }

    $postedData = json_decode(file_get_contents("php://input"));
    $to = "mike@soajs.org";// team
    $name = $postedData->name;
    $purpose = $postedData->purpose;
    $email = $postedData->email;
    $message = nl2br ( $postedData->message );
    $captcha = $postedData->captcha;

    $company = $postedData->company;
    $address = $postedData->address;
    $phone= $postedData->phone;
    $location= $postedData->location;
    $url= $postedData->github;
    $product= $postedData->product;

    if(isset($product) && sizeof($product) > 0){
        $projects = join($product, " - ");
    }

    if (! preg_match ( "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/", $email )) {
        buildResponse( 'Please enter a correct email format! ' );
    }

	if($postedData->isSubmitProject){
	
		$subject = "New Project from SOAJS Website";

		$body = <<<HTML
	<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
      <meta name="format-detection" content="telephone=no"> <!-- disable auto telephone linking in iOS -->
      <title>SOAJS</title>

      <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    table {
      border-spacing: 0;
    }

    table td {
      border-collapse: collapse;
    }

    .ExternalClass {
      width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }

    .ReadMsgBody {
      width: 100%;
      background-color: #ebebeb;
    }

    table {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    .yshortcuts a {
      border-bottom: none !important;
    }

    @media screen and (max-width: 599px) {
      .force-row,
      .container {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
    @media screen and (max-width: 400px) {
      .container-padding {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
    }
    .ios-footer a {
      color: #aaaaaa !important;
      text-decoration: underline;
    }
    </style>
    </head>

    <body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

    <!-- 100% background wrapper (grey background) -->
    <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0">
      <tr>
        <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;">
          <br>
          <!-- 600px container (white background) -->
          <table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px">
            <tr>
              <td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">
                SOAJS
              </td>
            </tr>
            <tr>
              <td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff">
                <br>
			    <div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">New Project Submitted</div>
			    <hr />
			    <br>
			    <div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">
			      <b>Company Name</b>:  $company<br>
			      <b>Company Address</b>:  $address<br>
			      <b>Contact Name</b>:  $name<br>
			      <b>Contact Email</b>:  $email<br>
			      <b>Contact Phone</b>:  $phone<br>
			      <b>Message</b>:<br>
			      $message
			    </div>
              </td>
            </tr>
            <tr>
              <td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px">
                <br>
                You are receiving this email because a form was submitted on our website.
                <br><br>
                <strong>Regards</strong><br>
                <span class="ios-footer">
                  SOAJS<br>
                </span>
                <a href="http://www.soajs.org" style="color:#aaaaaa">www.soajs.org</a><br>
              </td>
            </tr>
          </table>
    <!--/600px container -->
        </td>
      </tr>
    </table>
    <!--/100% background wrapper-->
    </body>
    </html>
HTML;

    }

	else if($postedData->isContribute){

		$subject = "New Contributor from SOAJS Website";

		$body = <<<HTML

	<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
      <meta name="format-detection" content="telephone=no"> <!-- disable auto telephone linking in iOS -->
      <title>SOAJS</title>

      <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    table {
      border-spacing: 0;
    }

    table td {
      border-collapse: collapse;
    }

    .ExternalClass {
      width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }

    .ReadMsgBody {
      width: 100%;
      background-color: #ebebeb;
    }

    table {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    .yshortcuts a {
      border-bottom: none !important;
    }

    @media screen and (max-width: 599px) {
      .force-row,
      .container {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
    @media screen and (max-width: 400px) {
      .container-padding {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
    }
    .ios-footer a {
      color: #aaaaaa !important;
      text-decoration: underline;
    }
    </style>
    </head>

    <body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

    <!-- 100% background wrapper (grey background) -->
    <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0">
      <tr>
        <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;">

          <br>

          <!-- 600px container (white background) -->
          <table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px">
            <tr>
              <td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">
                SOAJS
              </td>
            </tr>
            <tr>
              <td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff">
                <br>
				    <div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">I Want to Contribute on these Projects: $projects</div>
				    <hr />
				    <br>
				    <div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">
				      <b>Contact Name</b>:  $name<br>
				      <b>Contact Email</b>:  $email<br>
				      <b>Location</b>:  $location<br>
				      <b>Github Link</b>:  $url<br>
				      <b>Message</b>:<br />
				      $message
				    </div>
              </td>
            </tr>
            <tr>
              <td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px">
                <br>
                You are receiving this email because a form was submitted on our website.
                <br><br>
                <strong>Regards</strong><br>
                <span class="ios-footer">
                  SOAJS<br>
                </span>
                <a href="http://www.soajs.org" style="color:#aaaaaa">www.soajs.org</a><br>
              </td>
            </tr>
          </table>
    <!--/600px container -->
        </td>
      </tr>
    </table>
    <!--/100% background wrapper-->
    </body>
    </html>
HTML;

    }

    else {
    
        $body = <<<HTML

	<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="en">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- So that mobile will display zoomed in -->
      <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- enable media queries for windows phone 8 -->
      <meta name="format-detection" content="telephone=no"> <!-- disable auto telephone linking in iOS -->
      <title>SOAJS</title>

      <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    table {
      border-spacing: 0;
    }

    table td {
      border-collapse: collapse;
    }

    .ExternalClass {
      width: 100%;
    }

    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
      line-height: 100%;
    }

    .ReadMsgBody {
      width: 100%;
      background-color: #ebebeb;
    }

    table {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    .yshortcuts a {
      border-bottom: none !important;
    }

    @media screen and (max-width: 599px) {
      .force-row,
      .container {
        width: 100% !important;
        max-width: 100% !important;
      }
    }
    @media screen and (max-width: 400px) {
      .container-padding {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
    }
    .ios-footer a {
      color: #aaaaaa !important;
      text-decoration: underline;
    }
    </style>
    </head>

    <body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">

    <!-- 100% background wrapper (grey background) -->
    <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0">
      <tr>
        <td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;">
          <br>
          <!-- 600px container (white background) -->
          <table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px">
            <tr>
              <td class="container-padding header" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;padding-bottom:12px;color:#DF4726;padding-left:24px;padding-right:24px">
                SOAJS
              </td>
            </tr>
            <tr>
              <td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff">
                <br>
				    <div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550">$purpose</div>
				    <hr />
				    <br>
				    <div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333">
				      <b>From</b>:  $name<br />
				      <b>Email</b>:  $email<br />
				      <b>Message</b>:<br />
				      $message
				    </div>
              </td>
            </tr>
            <tr>
              <td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px">
                 <br>
                 You are receiving this email because a form was submitted on our website.
                 <br><br>
                    <strong>Regards</strong><br>
                    <span class="ios-footer">
                      SOAJS<br>
                    </span>
                    <a href="http://www.soajs.org" style="color:#aaaaaa">www.soajs.org</a><br>
              </td>
            </tr>
          </table>
    <!--/600px container -->
        </td>
      </tr>
    </table>
    <!--/100% background wrapper-->
    </body>
    </html>
HTML;
    
    }

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "X-Priority: 3\r\n";
    $headers .= "X-MSMail-Priority: Normal\r\n";
    $headers .= "From: $name <$email>\r\n";
    $headers .= "Organization: SOAJS\r\n";
    $headers .= "To: SOAJS TEAM <$to>\r\n";
    $headers .= "Date: " . date ( "D, d M Y H:m:s O", time () ) . "\r\n";
    $headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
    $headers .= "Return-Path: " . $name . " <" . $email . ">\r\n";
    $headers .= "X-Mailer: PHP" . phpversion () . "\r\n";
    $headers .= "X-Sender-IP: " . getenv ( 'REMOTE_ADDR' ) . "\r\n";
    $headers .= "Content-Transfer-Encoding: 7bit\r\n";
	
    $status = mail ( $to, $subject, $body, $headers );

    if ($status)
        buildResponse(null);
        else
            buildResponse('An error occured while sending the message. Please try again.' );

?>