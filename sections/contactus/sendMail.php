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
    $to = "dragonheart.jamil@gmail.com";// team
    $name = $postedData->name;
    $purpose = $postedData->purpose;
    $email = $postedData->email;
    $message = nl2br ( $postedData->message );
    $captcha = $postedData->captcha;

    if (! preg_match ( "/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/", $email )) {
        buildResponse( 'Please enter a correct email format! ' );
    }
/* tmp disable  ja2restore
    if(!checkGoogleReCaptcha($captcha)){
        buildResponse( 'Invalid Captcha Provided.');
    }
*/

	if($postedData->isRequestDemo){
	$subject = "New Demo Request from SOAJS Website";
	
	$body = <<<HTML
        Dear Administrator,<br/>
        The following message has been sent from the Request a Demo Section of SOAJS Website.<br /><br />
        <table cellspacing='1' cellpadding='3' border='0' width='1000' align='center'>
        <tr>
        <td width='70' align='left'><strong>Name:</strong></td>
        <td align='left'>$name</td>
        </tr>
        <tr>
        <td width='70' align='left'><strong>E-mail:</strong></td>
        <td align='left'>$email</td>
        </tr>
        <tr>
        <td width='70' align='left'><strong>Purpose:</strong></td>
        <td align='left'>$purpose</td>
        </tr>
        <tr>
        <td colspan='2' align='left'>
          <strong>Message:</strong><br />
          $message
        </td>
        </tr>
        </table><br /><br />
        Regards,<br/>
        SOAJS Website.
    HTML;
    
	}
	else if($postedData->isSubmitProject){
	
	$subject = "New Project from SOAJS Website";
	
	$body = <<<HTML
	    Dear Administrator,<br/>
	    The following message has been sent from the Contact Us Section of SOAJS Website.<br /><br />
	    <table cellspacing='1' cellpadding='3' border='0' width='1000' align='center'>
	    <tr>
	    <td width='70' align='left'><strong>Name:</strong></td>
	    <td align='left'>$name</td>
	    </tr>
	    <tr>
	    <td width='70' align='left'><strong>E-mail:</strong></td>
	    <td align='left'>$email</td>
	    </tr>
	    <tr>
	    <td width='70' align='left'><strong>Purpose:</strong></td>
	    <td align='left'>$purpose</td>
	    </tr>
	    <tr>
	    <td colspan='2' align='left'>
	      <strong>Message:</strong><br />
	      $message
	    </td>
	    </tr>
	    </table><br /><br />
	    Regards,<br/>
	    SOAJS Website.
HTML;

    }
    else {
    
    $body = <<<HTML
        Dear Administrator,<br/>
        The following message has been sent from the Contact Us Section of SOAJS Website.<br /><br />
        <table cellspacing='1' cellpadding='3' border='0' width='1000' align='center'>
        <tr>
        <td width='70' align='left'><strong>Name:</strong></td>
        <td align='left'>$name</td>
        </tr>
        <tr>
        <td width='70' align='left'><strong>E-mail:</strong></td>
        <td align='left'>$email</td>
        </tr>
        <tr>
        <td width='70' align='left'><strong>Purpose:</strong></td>
        <td align='left'>$purpose</td>
        </tr>
        <tr>
        <td colspan='2' align='left'>
          <strong>Message:</strong><br />
          $message
        </td>
        </tr>
        </table><br /><br />
        Regards,<br/>
        SOAJS Website.
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